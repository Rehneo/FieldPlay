package com.rehneo.fieldplaybackend.session;


import com.rehneo.fieldplaybackend.search.SearchCriteriaDto;
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
    @PreAuthorize("hasAuthority('USER') or hasAuthority('FIELD_ADMIN')")
    public ResponseEntity<Page<SessionReadDto>> findAllMy(Pageable pageable) {
        Page<SessionReadDto> sessions = service.findAllMy(pageable);
        return ResponseEntity.ok()
                .header("X-Total-Count", String.valueOf(sessions.getTotalElements()))
                .body(sessions);
    }

    @PostMapping("/search")
    public ResponseEntity<Page<SessionReadDto>> search(
            @RequestBody(required = false) SearchCriteriaDto searchCriteria,
            Pageable pageable
    ) {
        Page<SessionReadDto> sessions = service.search(searchCriteria, pageable);
        return ResponseEntity.ok()
                .header("X-Total-Count", String.valueOf(sessions.getTotalElements()))
                .body(sessions);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('FIELD_ADMIN')")
    public ResponseEntity<SessionReadDto> create(@RequestBody SessionCreateDto createDto) {
        return ResponseEntity.ok().body(service.create(createDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('FIELD_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('FIELD_ADMIN')")
    public ResponseEntity<SessionReadDto> edit(@PathVariable int id, @RequestBody SessionEditDto editDto) {
        return ResponseEntity.ok().body(service.edit(id, editDto));
    }
}
