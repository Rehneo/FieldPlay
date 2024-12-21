package com.rehneo.fieldplaybackend.session;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionCreateDto {

    @NotNull(message = "id футбольного поля должно присутствовать")
    private int fieldId;
    @NotNull(message = "Цена за бронирование должна присутствовать")
    @Positive(message = "Цена за бронирование должна быть больше 0")
    private int bookingPrice;
    @NotNull(message = "Цена за запись должна присутствовать")
    @Positive(message = "Цена за запись должна быть больше 0")
    private int signUpPrice;
    @NotNull(message = "Минимальное количество игроков должно присутствовать")
    @Positive(message = "Минимальное количество игроков должно быть больше 0")
    private int minPlayers;
    @NotNull(message = "Время начала должно присутствовать")
    private ZonedDateTime startsAt;
}
