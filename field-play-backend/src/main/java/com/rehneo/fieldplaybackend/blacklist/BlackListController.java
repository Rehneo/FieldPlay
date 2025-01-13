package com.rehneo.fieldplaybackend.blacklist;


import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/v1/blacklists", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class BlackListController {

    private final BlackListService service;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('FILED_ADMIN')")
    public ResponseEntity<Page<BlackListReadDto>> findAllByCompany(
            @RequestParam int companyId,
            Pageable pageable
    ) {
        Page<BlackListReadDto> blacklists = service.findAllByCompany(companyId, pageable);
        return ResponseEntity.ok()
                .header("X-Total-Count", String.valueOf(blacklists.getTotalElements()))
                .body(blacklists);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('FILED_ADMIN')")
    public ResponseEntity<BlackListReadDto> create(@RequestBody BlackListCreateDto createDto) {
        BlackListReadDto blacklist = service.create(createDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(blacklist);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('FILED_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
