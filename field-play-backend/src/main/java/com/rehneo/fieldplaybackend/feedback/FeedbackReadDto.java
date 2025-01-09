package com.rehneo.fieldplaybackend.feedback;

import com.rehneo.fieldplaybackend.user.UserReadDto;
import lombok.Builder;
import lombok.Data;

import java.time.ZonedDateTime;

@Data
@Builder
public class FeedbackReadDto {
    private int id;
    private UserReadDto user;
    private int fieldId;
    private String fieldName;
    private int rating;
    private String message;
    private ZonedDateTime createdAt;
}
