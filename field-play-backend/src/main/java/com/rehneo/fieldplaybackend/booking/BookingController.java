package com.rehneo.fieldplaybackend.booking;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/v1/sessions", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class BookingController {
    private final BookingService service;

    @PostMapping("/{id}/book")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<BookingReadDto> book(@PathVariable int id) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.book(id));
    }

    @GetMapping("/my-bookings")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<BookingReadDto> findMy(@RequestParam int sessionId) {
        return ResponseEntity.ok(service.findMy(sessionId));
    }
}
