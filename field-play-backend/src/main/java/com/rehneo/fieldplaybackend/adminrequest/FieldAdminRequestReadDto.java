package com.rehneo.fieldplaybackend.adminrequest;

import com.rehneo.fieldplaybackend.user.UserReadDto;
import lombok.Builder;
import lombok.Data;

import java.time.ZonedDateTime;

@Data
@Builder
public class FieldAdminRequestReadDto {
    private int id;

    private UserReadDto user;

    private Integer companyId;

    private String companyName;

    private ZonedDateTime createdAt;

    private Status status;
    private UserReadDto approvedBy;

    private ZonedDateTime approvedAt;
}