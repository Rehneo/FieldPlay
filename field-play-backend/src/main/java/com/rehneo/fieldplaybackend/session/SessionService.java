package com.rehneo.fieldplaybackend.session;

import com.rehneo.fieldplaybackend.booking.BookingRepository;
import com.rehneo.fieldplaybackend.error.AccessDeniedException;
import com.rehneo.fieldplaybackend.error.ResourceNotFoundException;
import com.rehneo.fieldplaybackend.fieldadmins.FieldAdminService;
import com.rehneo.fieldplaybackend.footballfield.data.FootballField;
import com.rehneo.fieldplaybackend.footballfield.FootballFieldRepository;
import com.rehneo.fieldplaybackend.search.SearchCriteriaDto;
import com.rehneo.fieldplaybackend.search.SearchMapper;
import com.rehneo.fieldplaybackend.signups.SignUpRepository;
import com.rehneo.fieldplaybackend.user.User;
import com.rehneo.fieldplaybackend.user.UserNotFoundException;
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
    private final SearchMapper<Session> searchMapper;
    private final SignUpRepository signUpRepository;
    private final BookingRepository bookingRepository;

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

    public Page<SessionReadDto> search(SearchCriteriaDto criteria, Pageable pageable) {
        Page<Session> sessions = repository.findAll(searchMapper.map(criteria), pageable);
        try {
            User currentUser = userService.getCurrentUser();
            return sessions.map(s -> {
                SessionReadDto dto = mapper.map(s);
                dto.setSignUpCount(repository.getSignUpCount(dto.getId()));
                dto.setMaxPlayers(repository.getMaxPlayers(dto.getId()));
                dto.setSignedUp(signUpRepository.existsByUserIdAndSessionId(currentUser.getId(), s.getId()));
                dto.setBooked(bookingRepository.existsByUserAndSession(currentUser, s));
                return dto;
            });
        } catch (UserNotFoundException e) {
            return sessions.map(s -> {
                SessionReadDto dto = mapper.map(s);
                dto.setSignUpCount(repository.getSignUpCount(dto.getId()));
                dto.setMaxPlayers(repository.getMaxPlayers(dto.getId()));
                dto.setSignedUp(false);
                dto.setBooked(false);
                return dto;
            });
        }
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

    @Transactional
    public void delete(int sessionId) {
        Session session = repository.findById(sessionId).orElseThrow(
                () -> new ResourceNotFoundException("Сеанса с id: " + sessionId + " не существует")
        );
        User currentUser = userService.getCurrentUser();
        if (!fieldAdminService.exists(currentUser.getId(), session.getFootballField().getCompany().getId())) {
            throw new AccessDeniedException("Вы не являетесь админом данного поля");
        }
        repository.delete(session);
    }

    @Transactional
    public SessionReadDto edit(int sessionId, SessionEditDto editDto) {
        Session session = repository.findById(sessionId).orElseThrow(
                () -> new ResourceNotFoundException("Сеанса с id: " + sessionId + " не существует")
        );
        User currentUser = userService.getCurrentUser();
        if (!fieldAdminService.exists(currentUser.getId(), session.getFootballField().getCompany().getId())) {
            throw new AccessDeniedException("Вы не являетесь админом данного поля");
        }
        session.setBookingPrice(editDto.getBookingPrice());
        session.setSignUpPrice(editDto.getSignUpPrice());
        session.setMinPlayers(editDto.getMinPlayers());
        repository.save(session);
        return mapper.map(session);
    }
}
