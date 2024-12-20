package com.rehneo.fieldplaybackend.auth;
import com.rehneo.fieldplaybackend.user.UserReadDto;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationResponse {
    private String token;
    private UserReadDto user;
}