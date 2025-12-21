package com.rehneo.fieldplaybackend.feedback;

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
public class FeedbackStorage {
    private final FeedbackRepository repository;

    @Transactional(readOnly = true)
    Page<Feedback> findAllByFootballFieldIdOrderByCreatedAtDesc(int fieldId, Pageable pageable) {
        return repository.findAllByFootballFieldIdOrderByCreatedAtDesc(fieldId, pageable);
    }

    @Transactional(readOnly = true)
    Page<Feedback> findAllByUserOrderByCreatedAtDesc(User user, Pageable pageable) {
        return repository.findAllByUserOrderByCreatedAtDesc(user, pageable);
    }

    @Transactional(readOnly = true)
    Page<Feedback> findAll(Specification<Feedback> criteria, Pageable pageable) {
        return repository.findAll(criteria, pageable);
    }

    @Transactional
    public void deleteById(int id) {
        repository.deleteById(id);
    }

    @Transactional(readOnly = true)
    boolean existsByUserIdAndFootballFieldId(int userId, int fieldId) {
        return repository.existsByUserIdAndFootballFieldId(userId, fieldId);
    }

    @Transactional
    public Feedback save(Feedback feedback) {
        return repository.save(feedback);
    }

    @Transactional(readOnly = true)
    public Feedback findById(int id) {
        return repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Отзыва с id: " + id + " не существует")
        );
    }
}
