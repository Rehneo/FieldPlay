package com.rehneo.fieldplaybackend.integration;

import com.rehneo.fieldplaybackend.annotation.IT;
import com.rehneo.fieldplaybackend.session.Session;
import com.rehneo.fieldplaybackend.session.SessionRepository;
import com.rehneo.fieldplaybackend.signups.SignUp;
import com.rehneo.fieldplaybackend.signups.SignUpRepository;
import com.rehneo.fieldplaybackend.user.User;
import com.rehneo.fieldplaybackend.user.UserRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;


import java.util.Optional;

@IT
@RequiredArgsConstructor
public class SessionSignUpConflictTest {
    private final SignUpRepository signUpRepository;
    private final SessionRepository sessionRepository;
    private final EntityManager entityManager;
    private final UserRepository userRepository;

    @Test
    @Rollback
    @Transactional
    void saveWithoutConflict() {
        Optional<Session> optionalSession = sessionRepository.findById(10);
        Assertions.assertTrue(optionalSession.isPresent());
        Session session = optionalSession.get();
        int signUpCount = sessionRepository.getSignUpCount(session.getId());
        Optional<User> userOptional = userRepository.findByUsername("rich_user");
        Assertions.assertTrue(userOptional.isPresent());
        User user = userOptional.get();
        int initialBalance = user.getBalance();
        signUpRepository.save(SignUp.builder().user(user).session(session).build());
        entityManager.refresh(user);
        Assertions.assertEquals(initialBalance, user.getBalance() + session.getSignUpPrice());
        Assertions.assertEquals(sessionRepository.getSignUpCount(session.getId()), signUpCount + 1);
    }

    @Test
    @Rollback
    @Transactional
    void saveWithBookedConflict() {
        Optional<Session> optionalSession = sessionRepository.findById(8);
        Assertions.assertTrue(optionalSession.isPresent());
        Session session = optionalSession.get();
        Optional<User> userOptional = userRepository.findByUsername("rich_user");
        Assertions.assertTrue(userOptional.isPresent());
        User user = userOptional.get();
        Assertions.assertThrows(JpaSystemException.class, () -> {
            signUpRepository.save(SignUp.builder().user(user).session(session).build());
        });
    }
}
