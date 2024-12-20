package com.rehneo.fieldplaybackend.user;

import org.springframework.stereotype.Service;

@Service
public class UserMapper {
    public UserReadDto map(User user){
        return UserReadDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .balance(user.getBalance())
                .role(user.getRole())
                .username(user.getUsername())
                .birth_date(user.getBirthDate())
                .build();
    }
}
