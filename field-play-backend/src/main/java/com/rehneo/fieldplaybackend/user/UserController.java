package com.rehneo.fieldplaybackend.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/v1/users", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PatchMapping("/me/balance")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('FIELD_ADMIN')")
    public ResponseEntity<UserReadDto> updateBalance(@RequestBody BalanceUpdateDto balance) {
        return ResponseEntity.ok(userService.updateBalance(balance));
    }
}
