package com.rehneo.fieldplaybackend.session;


import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/v1/sessions", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class SessionController {

    private final SessionService service;


    @GetMapping("/my")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Page<SessionReadDto>> findAllMy(Pageable pageable) {
        Page<SessionReadDto> sessions = service.findAllMy(pageable);
        return ResponseEntity.ok()
                .header("X-Total-Count", String.valueOf(sessions.getTotalElements()))
                .body(sessions);
    }

    @PostMapping
    @PreAuthorize("hasRole('FIELD_ADMIN')")
    public ResponseEntity<SessionReadDto> create(@RequestBody SessionCreateDto createDto) {
        return ResponseEntity.ok().body(service.create(createDto));
    }
}
