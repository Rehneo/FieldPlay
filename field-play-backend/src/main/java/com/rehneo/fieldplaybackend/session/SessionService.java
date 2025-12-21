package com.rehneo.fieldplaybackend.session;

import com.rehneo.fieldplaybackend.booking.BookingStorage;
import com.rehneo.fieldplaybackend.error.AccessDeniedException;
import com.rehneo.fieldplaybackend.fieldadmins.FieldAdminService;
import com.rehneo.fieldplaybackend.footballfield.FootballFieldStorage;
import com.rehneo.fieldplaybackend.footballfield.data.FootballField;
import com.rehneo.fieldplaybackend.search.SearchCriteriaDto;
import com.rehneo.fieldplaybackend.search.SearchMapper;
import com.rehneo.fieldplaybackend.signups.SignUpStorage;
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
    private final SessionMapper mapper;
    private final SessionStorage storage;
    private final UserService userService;
    private final FieldAdminService fieldAdminService;
    private final FootballFieldStorage footballFieldStorage;
    private final SearchMapper<Session> searchMapper;
    private final SignUpStorage signUpStorage;
    private final BookingStorage bookingStorage;

    public Page<SessionReadDto> findAllMy(Pageable pageable) {
        User currentUser = userService.getCurrentUser();
        return storage.findAllByUser(currentUser, pageable).map(
                s -> {
                    SessionReadDto dto = mapper.map(s);
                    dto.setSignUpCount(storage.getSignUpCount(dto.getId()));
                    dto.setMaxPlayers(storage.getMaxPlayers(dto.getId()));
                    return dto;
                }
        );
    }

    public Page<SessionReadDto> search(SearchCriteriaDto criteria, Pageable pageable) {
        Page<Session> sessions = storage.findAll(searchMapper.map(criteria), pageable);
        try {
            User currentUser = userService.getCurrentUser();
            return sessions.map(s -> {
                SessionReadDto dto = mapper.map(s);
                dto.setSignUpCount(storage.getSignUpCount(dto.getId()));
                dto.setMaxPlayers(storage.getMaxPlayers(dto.getId()));
                dto.setSignedUp(signUpStorage.existsByUserIdAndSessionId(currentUser.getId(), s.getId()));
                dto.setBooked(bookingStorage.existsByUserAndSession(currentUser, s));
                return dto;
            });
        } catch (UserNotFoundException e) {
            return sessions.map(s -> {
                SessionReadDto dto = mapper.map(s);
                dto.setSignUpCount(storage.getSignUpCount(dto.getId()));
                dto.setMaxPlayers(storage.getMaxPlayers(dto.getId()));
                dto.setSignedUp(false);
                dto.setBooked(false);
                return dto;
            });
        }
    }

    @Transactional
    public SessionReadDto create(SessionCreateDto createDto) {
        FootballField field = footballFieldStorage.findById(createDto.getFieldId());
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
        return mapper.map(storage.save(session));
    }

    @Transactional
    public void delete(int sessionId) {
        Session session = storage.findById(sessionId);
        User currentUser = userService.getCurrentUser();
        if (!fieldAdminService.exists(currentUser.getId(), session.getFootballField().getCompany().getId())) {
            throw new AccessDeniedException("Вы не являетесь админом данного поля");
        }
        storage.delete(session);
    }

    @Transactional
    public SessionReadDto edit(int sessionId, SessionEditDto editDto) {
        Session session = storage.findById(sessionId);
        User currentUser = userService.getCurrentUser();
        if (!fieldAdminService.exists(currentUser.getId(), session.getFootballField().getCompany().getId())) {
            throw new AccessDeniedException("Вы не являетесь админом данного поля");
        }
        session.setBookingPrice(editDto.getBookingPrice());
        session.setSignUpPrice(editDto.getSignUpPrice());
        session.setMinPlayers(editDto.getMinPlayers());
        return mapper.map(storage.save(session));
    }
}
