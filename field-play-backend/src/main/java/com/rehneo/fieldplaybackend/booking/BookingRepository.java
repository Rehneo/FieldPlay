package com.rehneo.fieldplaybackend.booking;

import com.rehneo.fieldplaybackend.session.Session;
import com.rehneo.fieldplaybackend.user.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookingRepository extends CrudRepository<Booking, Integer> {
    Optional<Booking> findByUserAndSession(User user, Session session);
}
