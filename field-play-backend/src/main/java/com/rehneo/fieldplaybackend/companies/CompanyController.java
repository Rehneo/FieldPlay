package com.rehneo.fieldplaybackend.companies;


import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/v1/companies", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService service;

    @GetMapping("/my")
    @PreAuthorize("hasRole('FILED_ADMIN')")
    public ResponseEntity<Page<CompanyReadDto>> findAllMy(Pageable pageable) {
        Page<CompanyReadDto> companies = service.findAllByUser(pageable);
        return ResponseEntity.ok()
                .header("X-Total-Count", String.valueOf(companies.getTotalElements()))
                .body(companies);
    }
}
