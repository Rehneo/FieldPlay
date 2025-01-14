package com.rehneo.fieldplaybackend.user;

import com.rehneo.fieldplaybackend.error.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;


    public User getByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(
                        "User with username: " + username + " not found")
                );

    }

    public UserReadDto updateBalance(BalanceUpdateDto balance) {
        if (balance.getAmount() <= 0) throw new BadRequestException("Сумма пополнения должна быть больше 0");
        User user = getCurrentUser();
        user.setBalance(user.getBalance() + balance.getAmount());
        userRepository.save(user);
        return userMapper.map(user);
    }

    public User getCurrentUser() {
        var username = SecurityContextHolder.getContext().getAuthentication().getName();
        return getByUsername(username);
    }

    public int getBalanceByUser(User user) {
        return userRepository.getBalanceByUser(user);
    }
}