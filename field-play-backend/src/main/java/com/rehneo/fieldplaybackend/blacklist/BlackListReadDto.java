package com.rehneo.fieldplaybackend.blacklist;


import com.rehneo.fieldplaybackend.user.UserReadDto;
import lombok.Builder;
import lombok.Data;

import java.time.ZonedDateTime;

@Data
@Builder
public class BlackListReadDto {
    private int id;
    private UserReadDto user;
    private int companyId;
    private String companyName;
    private String reason;
    private ZonedDateTime createdAt;
}
