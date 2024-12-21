package com.rehneo.fieldplaybackend.signups;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/v1/sessions", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class SignUpController {
    private final SignUpService service;

    @PostMapping("/{id}/sign-up")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<SignUpReadDto> signUp(@PathVariable int id) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.signUp(id));
    }

    @DeleteMapping("/{id}/cancel")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> cancelSignUp(@PathVariable int id) {
        service.cancelSignUp(id);
        return ResponseEntity.noContent().build();
    }
}
