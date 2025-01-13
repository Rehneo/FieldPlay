package com.rehneo.fieldplaybackend.footballfield;


import com.rehneo.fieldplaybackend.footballfield.data.dto.FootballFieldCreateDto;
import com.rehneo.fieldplaybackend.footballfield.data.dto.FootballFieldEditDto;
import com.rehneo.fieldplaybackend.footballfield.data.dto.FootballFieldFullReadDto;
import com.rehneo.fieldplaybackend.footballfield.data.dto.FootballFieldReadDto;
import com.rehneo.fieldplaybackend.search.SearchCriteriaDto;
import com.rehneo.fieldplaybackend.session.SessionReadDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/v1/football-fields", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class FootballFieldController {

    private final FootballFieldService service;

    @GetMapping("/{id}")
    public ResponseEntity<FootballFieldFullReadDto> findById(@PathVariable int id) {
        return ResponseEntity.ok().body(service.findById(id));
    }

    @PostMapping("/search")
    public ResponseEntity<Page<FootballFieldReadDto>> search(
            @RequestBody(required = false) SearchCriteriaDto searchCriteria,
            Pageable pageable
    ) {
        Page<FootballFieldReadDto> fields = service.search(searchCriteria, pageable);
        return ResponseEntity.ok()
                .header("X-Total-Count", String.valueOf(fields.getTotalElements()))
                .body(fields);
    }


    @PostMapping
    @PreAuthorize("hasAuthority('FIELD_ADMIN')")
    public ResponseEntity<FootballFieldFullReadDto> create(@RequestBody FootballFieldCreateDto createDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(createDto));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('FIELD_ADMIN')")
    public ResponseEntity<FootballFieldFullReadDto> update(
            @PathVariable int id, @RequestBody FootballFieldEditDto editDto
    ) {
        return ResponseEntity.ok().body(service.edit(id, editDto));
    }
}
