package com.rehneo.fieldplaybackend.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.sql.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignUpRequest {
    @NotNull(message = "Имя пользователя должно присутствовать")
    @NotBlank(message = "Имя пользователя не должно быть пустым")
    private String firstName;

    @NotNull(message = "Фамилия пользователя должна присутствовать")
    @NotBlank(message = "Фамилия пользователя не должна быть пустой")
    private String lastName;

    @NotNull(message = "Дата рождения пользователя должна присутствовать")
    private Date birthDate;

    @NotNull
    @Size(min = 4, max = 128, message = "Логин должен содержать от 4 до 128 символов")
    private String username;

    @NotNull
    @Size(min = 6, max = 128, message = "Пароль должен содержать от 6 до 128 символов")
    private String password;
}
