package com.rehneo.fieldplaybackend.booking;

import com.rehneo.fieldplaybackend.error.ResourceNotFoundException;
import com.rehneo.fieldplaybackend.session.Session;
import com.rehneo.fieldplaybackend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class BookingStorage {
    private final BookingRepository repository;

    @Transactional(readOnly = true)
    public Booking findByUserAndSession(User user, Session session) {
        return repository.findByUserAndSession(user, session).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Пользователь: " + user.getUsername() + " не бронировал данную сессию"
                )
        );
    }

    @Transactional(readOnly = true)
    public boolean existsByUserAndSession(User user, Session session) {
        return repository.existsByUserAndSession(user, session);
    }

    @Transactional
    public Booking save(Booking booking) {
        return repository.save(booking);
    }
}
