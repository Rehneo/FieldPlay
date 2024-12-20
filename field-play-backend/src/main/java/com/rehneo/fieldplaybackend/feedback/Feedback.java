package com.rehneo.fieldplaybackend.feedback;

import com.rehneo.fieldplaybackend.footballfield.data.FootballField;
import com.rehneo.fieldplaybackend.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.ZonedDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "feedbacks")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    private int id;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;


    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "football_field_id", nullable = false)
    private FootballField footballField;

    @Enumerated(EnumType.ORDINAL)
    @Column(name = "rating")
    private Rating rating;

    @NotNull
    @Column(name = "message", nullable = false)
    private String message;

    @Column(name = "created_at", nullable = false)
    private ZonedDateTime createdAt;

    @PrePersist
    private void prePersist() {
        createdAt = ZonedDateTime.now();
    }
}
