package com.rehneo.fieldplaybackend.feedback;

import com.rehneo.fieldplaybackend.error.AccessDeniedException;
import com.rehneo.fieldplaybackend.error.ResourceNotFoundException;
import com.rehneo.fieldplaybackend.footballfield.FootballFieldRepository;
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
    private final FeedbackRepository repository;
    private final UserService userService;
    private final FootballFieldRepository fieldRepository;
    private final FeedbackMapper mapper;

    @Transactional
    public void delete(int id) {
        Feedback feedback = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Отзыва с id: " + id + " не существует")
        );
        User currentUser = userService.getCurrentUser();
        if (currentUser.isAdmin() || currentUser.getId() == feedback.getUser().getId()) {
            repository.deleteById(id);
        } else {
            throw new AccessDeniedException("Недостаточно прав для удаления отзыва");
        }
    }

    public Page<FeedbackReadDto> findAllByField(int fieldId, Pageable pageable) {
        return repository.findAllByFootballFieldId(fieldId, pageable).map(mapper::map);
    }

    public Page<FeedbackReadDto> findAllMy(Pageable pageable) {
        return repository.findAllByUser(userService.getCurrentUser(), pageable).map(mapper::map);
    }

    @Transactional
    public FeedbackReadDto create(FeedbackCreateDto createDto) {
        User currentUser = userService.getCurrentUser();
        Feedback feedback = Feedback.builder()
                .user(currentUser)
                .footballField(fieldRepository.findById(createDto.getFieldId()).orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Футбольного поля с id: " + createDto.getFieldId() + " не существует"
                        )
                ))
                .message(createDto.getMessage())
                .rating(createDto.getRating())
                .build();
        repository.save(feedback);
        return mapper.map(feedback);
    }
}