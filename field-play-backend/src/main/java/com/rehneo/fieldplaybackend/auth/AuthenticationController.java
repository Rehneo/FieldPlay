package com.rehneo.fieldplaybackend.auth;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/sign-up")
    public ResponseEntity<AuthenticationResponse> signUp(@RequestBody @Valid SignUpRequest signUpRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authenticationService.signUp(signUpRequest));
    }

    @PostMapping("/sign-in")
    public ResponseEntity<AuthenticationResponse> signIn(@RequestBody @Valid SignInRequest signInRequest) {
        return ResponseEntity.ok().body(authenticationService.signIn(signInRequest));
    }
}