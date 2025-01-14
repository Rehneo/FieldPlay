package com.rehneo.fieldplaybackend.fieldadmins;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/v1/field-admins", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class FieldAdminController {
    private final FieldAdminService service;

    @GetMapping("/is-admin")
    @PreAuthorize("hasAuthority('FIELD_ADMIN')")
    public ResponseEntity<Map<String, Boolean>> isUserAdmin(@RequestParam int companyId) {
        boolean admin = service.isAdmin(companyId);
        return ResponseEntity.ok(Collections.singletonMap("admin", admin));
    }
}
