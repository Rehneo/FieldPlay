package com.rehneo.fieldplaybackend.signups;

import com.rehneo.fieldplaybackend.error.ResourceNotFoundException;
import com.rehneo.fieldplaybackend.session.Session;
import com.rehneo.fieldplaybackend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class SignUpStorage {
    private final SignUpRepository repository;

    @Transactional(readOnly = true)
    public SignUp findByUserAndSession(User user, Session session) {
        return repository.findByUserAndSession(user, session).orElseThrow(
                () -> new ResourceNotFoundException("У пользователя: " + user.getUsername() + " нет данной записи")
        );
    }

    @Transactional(readOnly = true)
    public boolean existsByUserIdAndSessionId(Integer userId, Integer sessionId) {
        return repository.existsByUserIdAndSessionId(userId, sessionId);
    }

    @Transactional
    public SignUp save(SignUp signUp) {
        return repository.save(signUp);
    }

    @Transactional
    public void delete(SignUp signUp) {
        repository.delete(signUp);
    }
}
