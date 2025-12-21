package com.rehneo.fieldplaybackend.feedback;

import com.rehneo.fieldplaybackend.search.SearchCriteriaDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
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
    @PreAuthorize("hasAuthority('USER') or hasAuthority('FIELD_ADMIN')")
    public ResponseEntity<Page<FeedbackReadDto>> findAllMy(Pageable pageable) {
        Page<FeedbackReadDto> feedbacks = service.findAllMy(pageable);
        return ResponseEntity.ok()
                .header("X-Total-Count", String.valueOf(feedbacks.getTotalElements()))
                .body(feedbacks);
    }

    @PostMapping("/search")
    public ResponseEntity<Page<FeedbackReadDto>> search(
            @RequestBody(required = false) SearchCriteriaDto searchCriteria,
            Pageable pageable
    ) {
        Page<FeedbackReadDto> feedbacks = service.search(searchCriteria, pageable);
        return ResponseEntity.ok()
                .header("X-Total-Count", String.valueOf(feedbacks.getTotalElements()))
                .body(feedbacks);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER') or hasAuthority('FIELD_ADMIN')")
    public ResponseEntity<FeedbackReadDto> create(@RequestBody FeedbackCreateDto createDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(createDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER') or hasAuthority('FIELD_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
