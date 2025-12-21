package com.rehneo.fieldplaybackend.session;

import com.rehneo.fieldplaybackend.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SessionRepository extends JpaRepository<Session, Integer>, JpaSpecificationExecutor<Session> {

    @Query(value = "SELECT get_signup_count(:sessionId)", nativeQuery = true)
    int getSignUpCount(int sessionId);

    @Query(value = "SELECT get_max_players(:sessionId)", nativeQuery = true)
    int getMaxPlayers(int sessionId);


    @Query(
            value = "SELECT DISTINCT s FROM Session s " +
                    "LEFT JOIN SignUp su ON s.id = su.session.id " +
                    "LEFT JOIN Booking b ON s.id = b.session.id " +
                    "WHERE su.user = :user OR b.user = :user " +
                    "ORDER BY s.startsAt DESC"
    )
    Page<Session> findAllByUser(User user, Pageable pageable);
}
