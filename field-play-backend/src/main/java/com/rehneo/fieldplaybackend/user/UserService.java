package com.rehneo.fieldplaybackend.user;

import com.rehneo.fieldplaybackend.error.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public User getByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(
                        "Пользователь с логином: " + username + " не существует")
                );
    }

    @Transactional(readOnly = true)
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Transactional(readOnly = true)
    public User findById(int id) {
        return userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(
                "Пользователя с id: " + id + " не существует"
        ));
    }

    @Transactional
    public UserReadDto updateBalance(BalanceUpdateDto balance) {
        if (balance.getAmount() <= 0) throw new BadRequestException("Сумма пополнения должна быть больше 0");
        User user = getCurrentUser();
        user.setBalance(user.getBalance() + balance.getAmount());
        userRepository.save(user);
        return userMapper.map(user);
    }

    @Transactional(readOnly = true)
    public User getCurrentUser() {
        var username = SecurityContextHolder.getContext().getAuthentication().getName();
        return getByUsername(username);
    }

    @Transactional
    public User save(User user) {
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public int getBalanceByUser(User user) {
        return userRepository.getBalanceByUser(user);
    }
}