package com.rehneo.fieldplaybackend.signups;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/v1/sessions", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class SignUpController {
    private final SignUpService service;

    @PostMapping("/{id}/sign-up")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('FIELD_ADMIN')")
    public ResponseEntity<SignUpReadDto> signUp(@PathVariable int id) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.signUp(id));
    }

    @DeleteMapping("/{id}/cancel")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('FIELD_ADMIN')")
    public ResponseEntity<SignUpReadDto> cancelSignUp(@PathVariable int id) {
        return ResponseEntity.ok(service.cancelSignUp(id));
    }

    @GetMapping("/my-sign-ups")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('FIELD_ADMIN')")
    public ResponseEntity<SignUpReadDto> findMy(@RequestParam int sessionId) {
        return ResponseEntity.ok(service.findMy(sessionId));
    }

    @GetMapping("/is-signed-up")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('FIELD_ADMIN')")
    public ResponseEntity<Map<String, Boolean>> isUserSignedUp(@RequestParam int sessionId) {
        boolean isSignedUp = service.isUserSignedUp(sessionId);
        return ResponseEntity.ok(Collections.singletonMap("signedUp", isSignedUp));
    }
}
