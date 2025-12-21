package com.rehneo.fieldplaybackend.feedback;

import com.rehneo.fieldplaybackend.error.AccessDeniedException;
import com.rehneo.fieldplaybackend.error.ConflictException;
import com.rehneo.fieldplaybackend.footballfield.FootballFieldStorage;
import com.rehneo.fieldplaybackend.footballfield.data.FootballField;
import com.rehneo.fieldplaybackend.search.SearchCriteriaDto;
import com.rehneo.fieldplaybackend.search.SearchMapper;
import com.rehneo.fieldplaybackend.user.User;
import com.rehneo.fieldplaybackend.user.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FeedbackServiceTest {
    @Mock
    UserService userService;
    @Mock
    FootballFieldStorage footballFieldStorage;
    @Mock
    FeedbackMapper mapper;
    @Mock
    SearchMapper<Feedback> searchMapper;
    @Mock
    FeedbackStorage storage;

    @InjectMocks
    FeedbackService service;

    // ---------- delete ----------

    @Test
    void delete_admin_success() {
        Feedback feedback = mock(Feedback.class);
        User admin = mock(User.class);

        when(storage.findById(1)).thenReturn(feedback);
        when(userService.getCurrentUser()).thenReturn(admin);

        when(admin.isAdmin()).thenReturn(true);

        service.delete(1);

        verify(storage).deleteById(1);
    }

    @Test
    void delete_owner_success() {
        Feedback feedback = mock(Feedback.class);
        User user = mock(User.class);

        when(storage.findById(1)).thenReturn(feedback);
        when(userService.getCurrentUser()).thenReturn(user);

        when(user.isAdmin()).thenReturn(false);
        when(user.getId()).thenReturn(1);
        when(feedback.getUser()).thenReturn(user);

        service.delete(1);

        verify(storage).deleteById(1);
    }

    @Test
    void delete_accessDenied() {
        Feedback feedback = mock(Feedback.class);
        User user = mock(User.class);
        User author = mock(User.class);

        when(storage.findById(1)).thenReturn(feedback);
        when(userService.getCurrentUser()).thenReturn(user);

        when(user.isAdmin()).thenReturn(false);
        when(user.getId()).thenReturn(1);
        when(author.getId()).thenReturn(2);
        when(feedback.getUser()).thenReturn(author);

        assertThrows(
                AccessDeniedException.class,
                () -> service.delete(1)
        );
    }

    // ---------- findAllByField ----------

    @Test
    void findAllByField_success() {
        Pageable pageable = PageRequest.of(0, 10);
        Feedback feedback = mock(Feedback.class);
        FeedbackReadDto dto = mock(FeedbackReadDto.class);

        when(storage.findAllByFootballFieldIdOrderByCreatedAtDesc(10, pageable))
                .thenReturn(new PageImpl<>(List.of(feedback)));

        when(mapper.map(feedback)).thenReturn(dto);

        Page<FeedbackReadDto> result =
                service.findAllByField(10, pageable);

        assertEquals(1, result.getTotalElements());
    }

    // ---------- findAllMy ----------

    @Test
    void findAllMy_success() {
        Pageable pageable = PageRequest.of(0, 10);

        User user = mock(User.class);
        Feedback feedback = mock(Feedback.class);
        FeedbackReadDto dto = mock(FeedbackReadDto.class);

        when(userService.getCurrentUser()).thenReturn(user);
        when(storage.findAllByUserOrderByCreatedAtDesc(user, pageable))
                .thenReturn(new PageImpl<>(List.of(feedback)));

        when(mapper.map(feedback)).thenReturn(dto);

        Page<FeedbackReadDto> result = service.findAllMy(pageable);

        assertEquals(1, result.getTotalElements());
    }

    // ---------- search ----------

    @Test
    void search_success() {
        Pageable pageable = PageRequest.of(0, 10);
        SearchCriteriaDto criteria = mock(SearchCriteriaDto.class);
        Feedback feedback = mock(Feedback.class);
        FeedbackReadDto dto = mock(FeedbackReadDto.class);

        when(storage.findAll(any(), eq(pageable)))
                .thenReturn(new PageImpl<>(List.of(feedback)));

        when(mapper.map(feedback)).thenReturn(dto);

        Page<FeedbackReadDto> result = service.search(criteria, pageable);

        assertEquals(1, result.getTotalElements());
    }

    // ---------- create ----------

    @Test
    void create_success() {
        FeedbackCreateDto createDto = mock(FeedbackCreateDto.class);
        User user = mock(User.class);
        FootballField field = mock(FootballField.class);
        Feedback saved = mock(Feedback.class);
        FeedbackReadDto dto = mock(FeedbackReadDto.class);

        when(userService.getCurrentUser()).thenReturn(user);
        when(user.getId()).thenReturn(1);

        when(createDto.getFieldId()).thenReturn(10);
        when(createDto.getMessage()).thenReturn("message");
        when(createDto.getRating()).thenReturn(5);

        when(storage.existsByUserIdAndFootballFieldId(1, 10)).thenReturn(false);
        when(footballFieldStorage.findById(10)).thenReturn(field);

        when(storage.save(any(Feedback.class))).thenReturn(saved);
        when(mapper.map(saved)).thenReturn(dto);

        FeedbackReadDto result = service.create(createDto);

        assertNotNull(result);
        verify(storage).save(any(Feedback.class));
    }

    @Test
    void create_conflict() {
        FeedbackCreateDto createDto = mock(FeedbackCreateDto.class);
        User user = mock(User.class);

        when(userService.getCurrentUser()).thenReturn(user);
        when(user.getId()).thenReturn(1);
        when(createDto.getFieldId()).thenReturn(10);

        when(storage.existsByUserIdAndFootballFieldId(1, 10)).thenReturn(true);

        assertThrows(
                ConflictException.class,
                () -> service.create(createDto)
        );
    }
}