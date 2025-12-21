package com.rehneo.fieldplaybackend.session;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionReadDto {
    private int id;
    private int fieldId;
    private String fieldName;
    private int bookingPrice;
    private int signUpPrice;
    private int minPlayers;
    private int maxPlayers;
    private int signUpCount;
    private Status status;
    private ZonedDateTime startsAt;
    private boolean signedUp;
    private boolean booked;
}
