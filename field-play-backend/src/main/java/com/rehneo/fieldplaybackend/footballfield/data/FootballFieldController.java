package com.rehneo.fieldplaybackend.footballfield.data;


import com.rehneo.fieldplaybackend.footballfield.data.dto.FootballFieldCreateOrEditDto;
import com.rehneo.fieldplaybackend.footballfield.data.dto.FootballFieldFullReadDto;
import lombok.RequiredArgsConstructor;
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


    @PostMapping
    @PreAuthorize("hasRole('FIELD_ADMIN')")
    public ResponseEntity<FootballFieldFullReadDto> create(@RequestBody FootballFieldCreateOrEditDto createDto) {
        return ResponseEntity.ok().body(service.create(createDto));
    }
}
