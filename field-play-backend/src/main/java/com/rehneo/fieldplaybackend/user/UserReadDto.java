package com.rehneo.fieldplaybackend.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserReadDto {
    private int id;
    private String firstName;
    private String lastName;
    private String username;
    private Integer balance;
    private Role role;
    private Date birthDate;
}