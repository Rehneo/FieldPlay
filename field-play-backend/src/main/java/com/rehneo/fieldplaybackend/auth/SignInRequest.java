package com.rehneo.fieldplaybackend.auth;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignInRequest {

    @NotNull
    @Size(min = 4, max = 128, message = "Логин должен содержать от 4 до 128 символов")
    private String username;

    @NotNull
    @Size(min = 6, max = 128, message = "Пароль должен содержать от 6 до 128 символов")
    private String password;
}