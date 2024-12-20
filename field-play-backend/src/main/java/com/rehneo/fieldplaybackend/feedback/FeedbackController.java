package com.rehneo.fieldplaybackend.feedback;


import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/v1/feedbacks", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService service;

    @GetMapping
    public ResponseEntity<Page<FeedbackReadDto>> findAllByField(
            @RequestParam int fieldId,
            Pageable pageable
    ) {
        Page<FeedbackReadDto> feedbacks = service.findAllByField(fieldId, pageable);
        return ResponseEntity.ok()
                .header("X-Total-Count", String.valueOf(feedbacks.getTotalElements()))
                .body(feedbacks);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Page<FeedbackReadDto>> findAllMy(Pageable pageable) {
        Page<FeedbackReadDto> feedbacks = service.findAllMy(pageable);
        return ResponseEntity.ok()
                .header("X-Total-Count", String.valueOf(feedbacks.getTotalElements()))
                .body(feedbacks);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<FeedbackReadDto> create(@RequestBody FeedbackCreateDto createDto) {
        return ResponseEntity.ok().body(service.create(createDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
