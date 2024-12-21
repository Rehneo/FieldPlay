package com.rehneo.fieldplaybackend.session;

import com.rehneo.fieldplaybackend.footballfield.data.FootballField;
import com.rehneo.fieldplaybackend.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;

@Repository
public interface SessionRepository extends JpaRepository<Session, Integer> {

    Page<Session> findAllByFootballField(FootballField field, Pageable pageable);

    Page<Session> findAllByFootballFieldId(int fieldId, Pageable pageable);

    Page<Session> findAllByStartsAtBetween(ZonedDateTime start, ZonedDateTime end, Pageable pageable);

    Page<Session> findAllByStatusAndStartsAtBetweenAndFootballFieldId(
            Status status,
            ZonedDateTime start,
            ZonedDateTime end,
            int fieldId,
            Pageable pageable
    );

    @Query(value = "SELECT get_signup_count(:sessionId)", nativeQuery = true)
    int getSignUpCount(int sessionId);

    @Query(value = "SELECT get_max_players(:sessionId)", nativeQuery = true)
    int getMaxPlayers(int sessionId);


    @Query(value = "SELECT s FROM Session s " +
            "JOIN SignUp su ON s.id = su.session.id " +
            "WHERE su.user = :user " +
            "UNION " +
            "SELECT s FROM Session s " +
            "JOIN Booking b ON s.id = b.session.id " +
            "WHERE b.user = :user " +
            "ORDER BY s.startsAt DESC")
    Page<Session> findAllByUser(User user, Pageable pageable);
}
