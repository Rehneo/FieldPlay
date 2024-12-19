package com.rehneo.fieldplaybackend.session;


import com.rehneo.fieldplaybackend.footballfield.data.FootballField;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import org.hibernate.annotations.ColumnTransformer;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

import java.time.ZonedDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "sessions")
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    private int id;

    @NotNull
    @Column(name = "starts_at", nullable = false)
    private ZonedDateTime startsAt;


    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    @ColumnTransformer(write = "?::session_status")
    @Column(name = "status", nullable = false)
    private Status status;

    @NotNull
    @Positive
    @Column(name = "min_players", nullable = false)
    private Integer minPlayers;

    @NotNull
    @Positive
    @Column(name = "sign_up_price", nullable = false)
    private Integer signUpPrice;

    @NotNull
    @Positive
    @Column(name = "booking_price", nullable = false)
    private Integer bookingPrice;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "football_field_id", nullable = false)
    private FootballField footballField;
}
