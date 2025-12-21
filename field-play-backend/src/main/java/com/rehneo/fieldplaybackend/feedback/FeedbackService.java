package com.rehneo.fieldplaybackend.feedback;

import com.rehneo.fieldplaybackend.error.AccessDeniedException;
import com.rehneo.fieldplaybackend.error.ConflictException;
import com.rehneo.fieldplaybackend.footballfield.FootballFieldStorage;
import com.rehneo.fieldplaybackend.search.SearchCriteriaDto;
import com.rehneo.fieldplaybackend.search.SearchMapper;
import com.rehneo.fieldplaybackend.user.User;
import com.rehneo.fieldplaybackend.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FeedbackService {
    private final UserService userService;
    private final FootballFieldStorage footballFieldStorage;
    private final FeedbackMapper mapper;
    private final SearchMapper<Feedback> searchMapper;
    private final FeedbackStorage storage;

    @Transactional
    public void delete(int id) {
        Feedback feedback = storage.findById(id);
        User currentUser = userService.getCurrentUser();
        if (currentUser.isAdmin() || currentUser.getId() == feedback.getUser().getId()) {
            storage.deleteById(id);
        } else {
            throw new AccessDeniedException("Недостаточно прав для удаления отзыва");
        }
    }

    public Page<FeedbackReadDto> findAllByField(int fieldId, Pageable pageable) {
        return storage.findAllByFootballFieldIdOrderByCreatedAtDesc(fieldId, pageable).map(mapper::map);
    }

    public Page<FeedbackReadDto> findAllMy(Pageable pageable) {
        return storage.findAllByUserOrderByCreatedAtDesc(userService.getCurrentUser(), pageable).map(mapper::map);
    }

    public Page<FeedbackReadDto> search(SearchCriteriaDto criteria, Pageable pageable) {
        Page<Feedback> feedbacks = storage.findAll(searchMapper.map(criteria), pageable);
        return feedbacks.map(mapper::map);
    }

    @Transactional
    public FeedbackReadDto create(FeedbackCreateDto createDto) {
        User currentUser = userService.getCurrentUser();
        if (storage.existsByUserIdAndFootballFieldId(currentUser.getId(), createDto.getFieldId())) {
            throw new ConflictException("Текущий пользователь уже оставлял отзыв к данному полю");
        }
        Feedback feedback = Feedback.builder()
                .user(currentUser)
                .footballField(footballFieldStorage.findById(createDto.getFieldId()))
                .message(createDto.getMessage())
                .rating(createDto.getRating())
                .build();
        return mapper.map(storage.save(feedback));
    }
}