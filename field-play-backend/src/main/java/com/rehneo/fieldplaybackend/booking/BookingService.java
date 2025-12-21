package com.rehneo.fieldplaybackend.booking;

import com.rehneo.fieldplaybackend.blacklist.BlackListStorage;
import com.rehneo.fieldplaybackend.error.AccessDeniedException;
import com.rehneo.fieldplaybackend.session.Session;
import com.rehneo.fieldplaybackend.session.SessionStorage;
import com.rehneo.fieldplaybackend.user.User;
import com.rehneo.fieldplaybackend.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingMapper mapper;
    private final SessionStorage sessionStorage;
    private final BlackListStorage blackListStorage;
    private final UserService userService;
    private final BookingStorage storage;

    @Transactional
    public BookingReadDto book(int sessionId) {
        Session session = sessionStorage.findById(sessionId);
        User currentUser = userService.getCurrentUser();
        if (blackListStorage.existsByUserIdAndCompanyId(
                currentUser.getId(),
                session.getFootballField().getCompany().getId()
        )) {
            throw new AccessDeniedException("Вы находитесь в черном списке данной компании");
        }
        Booking booking = Booking.builder()
                .user(currentUser)
                .session(session)
                .build();
        storage.save(booking);
        booking.getUser().setBalance(userService.getBalanceByUser(currentUser));
        return mapper.map(booking);
    }

    @Transactional(readOnly = true)
    public BookingReadDto findMy(int sessionId) {
        Session session = sessionStorage.findById(sessionId);
        User currentUser = userService.getCurrentUser();
        Booking booking = storage.findByUserAndSession(currentUser, session);
        return mapper.map(booking);
    }

    @Transactional(readOnly = true)
    public boolean isUserBooked(int sessionId) {
        Session session = sessionStorage.findById(sessionId);
        User currentUser = userService.getCurrentUser();
        return storage.existsByUserAndSession(currentUser, session);
    }
}
