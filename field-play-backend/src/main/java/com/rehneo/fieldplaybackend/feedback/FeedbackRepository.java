package com.rehneo.fieldplaybackend.feedback;

import com.rehneo.fieldplaybackend.footballfield.data.FootballField;
import com.rehneo.fieldplaybackend.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {

    Page<Feedback> findAllByFootballField(FootballField field, Pageable pageable);

    Page<Feedback> findAllByFootballFieldId(int fieldId, Pageable pageable);

    Page<Feedback> findAllByUser(User user, Pageable pageable);

    Page<Feedback> findAllByUserId(int userId, Pageable pageable);
}
