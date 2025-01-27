package com.rehneo.fieldplaybackend.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);

    Optional<User> findById(int id);

    boolean existsByUsername(String username);

    boolean existsByPassword(String password);

    @Query(value = "select u.balance from User u where u =:user")
    int getBalanceByUser(User user);
}
