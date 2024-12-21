package com.rehneo.fieldplaybackend.signups;


import com.rehneo.fieldplaybackend.session.SessionReadDto;
import com.rehneo.fieldplaybackend.user.UserReadDto;
import lombok.Builder;
import lombok.Data;

import java.time.ZonedDateTime;

@Data
@Builder
public class SignUpReadDto {
    private int id;
    private UserReadDto user;
    private SessionReadDto session;
    private ZonedDateTime createdAt;
}
