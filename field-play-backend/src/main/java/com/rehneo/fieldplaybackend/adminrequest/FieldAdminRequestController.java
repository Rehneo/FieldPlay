package com.rehneo.fieldplaybackend.adminrequest;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/v1/field-admin-requests", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class FieldAdminRequestController {
    private final FieldAdminRequestService service;

    @GetMapping("/pending")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('FIELD_ADMIN')")
    public ResponseEntity<Page<FieldAdminRequestReadDto>> findAllPendingByCompany(
            @RequestParam int companyId,
            Pageable pageable
    ) {
        Page<FieldAdminRequestReadDto> requests = service.findAllByCompanyAndStatus(
                companyId,
                Status.PENDING,
                pageable);
        return ResponseEntity.ok()
                .header("X-Total-Count", String.valueOf(requests.getTotalElements()))
                .body(requests);
    }

    @GetMapping("/my")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('FIELD_ADMIN')")
    public ResponseEntity<FieldAdminRequestReadDto> findMyByCompany(@RequestParam int companyId) {
        FieldAdminRequestReadDto request = service.findMyByCompanyId(companyId);
        return ResponseEntity.ok(request);
    }

    @GetMapping("/approved")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('FIELD_ADMIN')")
    public ResponseEntity<Page<FieldAdminRequestReadDto>> findAllApprovedByCompany(
            @RequestParam int companyId,
            Pageable pageable
    ) {
        Page<FieldAdminRequestReadDto> requests = service.findAllByCompanyAndStatus(
                companyId,
                Status.APPROVED,
                pageable);
        return ResponseEntity.ok()
                .header("X-Total-Count", String.valueOf(requests.getTotalElements()))
                .body(requests);
    }

    @GetMapping("/rejected")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('FIELD_ADMIN')")
    public ResponseEntity<Page<FieldAdminRequestReadDto>> findAllRejectedByCompany(
            @RequestParam int companyId,
            Pageable pageable
    ) {
        Page<FieldAdminRequestReadDto> requests = service.findAllByCompanyAndStatus(
                companyId,
                Status.REJECTED,
                pageable);
        return ResponseEntity.ok()
                .header("X-Total-Count", String.valueOf(requests.getTotalElements()))
                .body(requests);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('USER') or hasAuthority('FIELD_ADMIN')")
    public ResponseEntity<FieldAdminRequestReadDto> create(@RequestParam int companyId) {
        FieldAdminRequestReadDto request = service.create(companyId);
        return ResponseEntity.status(HttpStatus.CREATED).body(request);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('FIELD_ADMIN')")
    public ResponseEntity<FieldAdminRequestReadDto> process(@PathVariable int id, @RequestParam boolean approved) {
        FieldAdminRequestReadDto request = service.process(id, approved);
        return ResponseEntity.ok().body(request);
    }
}
