package com.rehneo.fieldplaybackend.booking;

import com.rehneo.fieldplaybackend.error.ResourceNotFoundException;
import com.rehneo.fieldplaybackend.session.Session;
import com.rehneo.fieldplaybackend.session.SessionRepository;
import com.rehneo.fieldplaybackend.signups.SignUp;
import com.rehneo.fieldplaybackend.user.User;
import com.rehneo.fieldplaybackend.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository repository;
    private final BookingMapper mapper;
    private final SessionRepository sessionRepository;
    private final UserService userService;

    @Transactional
    public BookingReadDto book(int sessionId) {
        Session session = sessionRepository.findById(sessionId).orElseThrow(
                () -> new ResourceNotFoundException("Сессия с id: " + sessionId + " не найдена")
        );
        User currentUser = userService.getCurrentUser();
        Booking booking = Booking.builder()
                .user(currentUser)
                .session(session)
                .build();
        repository.save(booking);
        return mapper.map(booking);
    }
}
