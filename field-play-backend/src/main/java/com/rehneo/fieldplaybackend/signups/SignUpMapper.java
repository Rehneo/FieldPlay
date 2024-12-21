package com.rehneo.fieldplaybackend.signups;

import com.rehneo.fieldplaybackend.session.SessionMapper;
import com.rehneo.fieldplaybackend.user.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SignUpMapper {
    private final UserMapper userMapper;
    private final SessionMapper sessionMapper;

    public SignUpReadDto map(SignUp signUp) {
        return SignUpReadDto.builder()
                .id(signUp.getId())
                .createdAt(signUp.getCreatedAt())
                .session(sessionMapper.map(signUp.getSession()))
                .user(userMapper.map(signUp.getUser()))
                .build();
    }
}
