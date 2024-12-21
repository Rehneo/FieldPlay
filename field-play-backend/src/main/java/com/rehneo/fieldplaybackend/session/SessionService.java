package com.rehneo.fieldplaybackend.session;


import com.rehneo.fieldplaybackend.error.AccessDeniedException;
import com.rehneo.fieldplaybackend.error.ResourceNotFoundException;
import com.rehneo.fieldplaybackend.fieldadmins.FieldAdminService;
import com.rehneo.fieldplaybackend.footballfield.data.FootballField;
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
public class SessionService {
    private final SessionRepository repository;
    private final SessionMapper mapper;
    private final UserService userService;
    private final FieldAdminService fieldAdminService;
    private final FootballFieldRepository fieldRepository;


    public Page<SessionReadDto> findAllMy(Pageable pageable) {
        User currentUser = userService.getCurrentUser();
        return repository.findAllByUser(currentUser, pageable).map(
                s -> {
                    SessionReadDto dto = mapper.map(s);
                    dto.setSignUpCount(repository.getSignUpCount(dto.getId()));
                    dto.setMaxPlayers(repository.getMaxPlayers(dto.getId()));
                    return dto;
                }
        );
    }

    @Transactional
    public SessionReadDto create(SessionCreateDto createDto) {
        FootballField field = fieldRepository.findById(createDto.getFieldId()).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Футбольное поле с id: " + createDto.getFieldId() + "не найдено"
                )
        );
        User currentUser = userService.getCurrentUser();
        if (!fieldAdminService.exists(currentUser.getId(), field.getCompany().getId())) {
            throw new AccessDeniedException("Вы не являетесь админом данного поля");
        }
        Session session = Session.builder()
                .footballField(field)
                .bookingPrice(createDto.getBookingPrice())
                .signUpPrice(createDto.getSignUpPrice())
                .minPlayers(createDto.getMinPlayers())
                .startsAt(createDto.getStartsAt())
                .status(Status.ACTIVE)
                .build();
        repository.save(session);
        return mapper.map(session);
    }
}
