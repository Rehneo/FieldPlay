package com.rehneo.fieldplaybackend.signups;

import com.rehneo.fieldplaybackend.session.Session;
import com.rehneo.fieldplaybackend.user.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SignUpRepository extends CrudRepository<SignUp, Integer> {
    Optional<SignUp> findByUserAndSession(User user, Session session);

    boolean existsByUserIdAndSessionId(Integer userId, Integer sessionId);
}
