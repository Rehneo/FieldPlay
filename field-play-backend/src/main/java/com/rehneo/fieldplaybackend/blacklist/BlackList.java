package com.rehneo.fieldplaybackend.blacklist;


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
@Table(name = "blacklists")
public class BlackList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    private int id;


    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "football_field_id", nullable = false)
    private FootballField footballField;


    @NotNull
    @Column(name = "reason", nullable = false)
    private String reason;


    @Column(name = "created_at", nullable = false)
    private ZonedDateTime createdAt;

    @PrePersist
    private void prePersist() {
        createdAt = ZonedDateTime.now();
    }

}
