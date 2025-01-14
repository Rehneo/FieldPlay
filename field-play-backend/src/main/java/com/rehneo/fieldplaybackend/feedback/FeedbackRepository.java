package com.rehneo.fieldplaybackend.feedback;

import com.rehneo.fieldplaybackend.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer>, JpaSpecificationExecutor<Feedback> {

    Page<Feedback> findAllByFootballFieldIdOrderByCreatedAtDesc(int fieldId, Pageable pageable);

    Page<Feedback> findAllByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    Page<Feedback> findAllByUserId(int userId, Pageable pageable);

    boolean existsByUserIdAndFootballFieldId(int userId, int fieldId);

}
