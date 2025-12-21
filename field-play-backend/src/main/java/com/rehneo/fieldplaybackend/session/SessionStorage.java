package com.rehneo.fieldplaybackend.session;

import com.rehneo.fieldplaybackend.error.ResourceNotFoundException;
import com.rehneo.fieldplaybackend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class SessionStorage {
    private final SessionRepository repository;

    @Transactional(readOnly = true)
    public int getSignUpCount(int sessionId) {
        return repository.getSignUpCount(sessionId);
    }

    @Transactional(readOnly = true)
    public int getMaxPlayers(int sessionId) {
        return repository.getMaxPlayers(sessionId);
    }

    @Transactional(readOnly = true)
    public Page<Session> findAllByUser(User user, Pageable pageable) {
        return repository.findAllByUser(user, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Session> findAll(Specification<Session> criteria, Pageable pageable) {
        return repository.findAll(criteria, pageable);
    }

    @Transactional
    public void delete(Session session) {
        repository.delete(session);
    }

    @Transactional(readOnly = true)
    public Session findById(int sessionId) {
        return repository.findById(sessionId).orElseThrow(
                () -> new ResourceNotFoundException("Сеанса с id: " + sessionId + " не существует")
        );
    }

    @Transactional
    public Session save(Session session) {
        return repository.save(session);
    }
}
