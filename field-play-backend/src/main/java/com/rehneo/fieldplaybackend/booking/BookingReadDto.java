package com.rehneo.fieldplaybackend.booking;

import com.rehneo.fieldplaybackend.session.SessionReadDto;
import com.rehneo.fieldplaybackend.user.UserReadDto;
import lombok.Builder;
import lombok.Data;

import java.time.ZonedDateTime;

@Builder
@Data
public class BookingReadDto {
    private int id;
    private UserReadDto user;
    private SessionReadDto session;
    private ZonedDateTime createdAt;
}
