package com.rehneo.fieldplaybackend.feedback;

import com.rehneo.fieldplaybackend.user.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FeedbackMapper {
    private final UserMapper userMapper;

    public FeedbackReadDto map(Feedback feedback) {
        return FeedbackReadDto.builder()
                .id(feedback.getId())
                .user(userMapper.map(feedback.getUser()))
                .fieldId(feedback.getFootballField().getId())
                .fieldName(feedback.getFootballField().getName())
                .createdAt(feedback.getCreatedAt())
                .message(feedback.getMessage())
                .rating(feedback.getRating())
                .build();
    }
}
