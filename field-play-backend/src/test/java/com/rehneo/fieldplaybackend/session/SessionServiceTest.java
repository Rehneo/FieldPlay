package com.rehneo.fieldplaybackend.session;

import com.rehneo.fieldplaybackend.booking.BookingStorage;
import com.rehneo.fieldplaybackend.companies.Company;
import com.rehneo.fieldplaybackend.error.AccessDeniedException;
import com.rehneo.fieldplaybackend.fieldadmins.FieldAdminService;
import com.rehneo.fieldplaybackend.footballfield.FootballFieldStorage;
import com.rehneo.fieldplaybackend.footballfield.data.FootballField;
import com.rehneo.fieldplaybackend.search.SearchCriteriaDto;
import com.rehneo.fieldplaybackend.search.SearchMapper;
import com.rehneo.fieldplaybackend.signups.SignUpStorage;
import com.rehneo.fieldplaybackend.user.User;
import com.rehneo.fieldplaybackend.user.UserNotFoundException;
import com.rehneo.fieldplaybackend.user.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;

import java.time.ZonedDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SessionServiceTest {
    @Mock
    SessionMapper mapper;
    @Mock
    SessionStorage storage;
    @Mock
    UserService userService;
    @Mock
    FieldAdminService fieldAdminService;
    @Mock
    FootballFieldStorage footballFieldStorage;
    @Mock
    SearchMapper<Session> searchMapper;
    @Mock
    SignUpStorage signUpStorage;
    @Mock
    BookingStorage bookingStorage;

    @InjectMocks
    SessionService service;

    // ---------- findAllMy ----------

    @Test
    void findAllMy_success() {
        Pageable pageable = PageRequest.of(0, 10);
        User user = mock(User.class);
        Session session = mock(Session.class);
        SessionReadDto dto = mock(SessionReadDto.class);

        when(userService.getCurrentUser()).thenReturn(user);
        when(storage.findAllByUser(user, pageable)).thenReturn(new PageImpl<>(List.of(session)));
        when(mapper.map(session)).thenReturn(dto);
        when(storage.getSignUpCount(dto.getId())).thenReturn(5);
        when(storage.getMaxPlayers(dto.getId())).thenReturn(10);

        Page<SessionReadDto> result = service.findAllMy(pageable);

        assertEquals(1, result.getTotalElements());
        verify(dto).setSignUpCount(5);
        verify(dto).setMaxPlayers(10);
    }

    // ---------- search ----------

    @Test
    void search_userFound_success() {
        Pageable pageable = PageRequest.of(0, 10);
        SearchCriteriaDto criteria = mock(SearchCriteriaDto.class);
        Specification specification = mock(Specification.class);
        Session session = mock(Session.class);
        SessionReadDto dto = mock(SessionReadDto.class);
        User user = mock(User.class);

        when(searchMapper.map(criteria)).thenReturn(specification);
        when(storage.findAll(specification, pageable)).thenReturn(new PageImpl<>(List.of(session)));
        when(userService.getCurrentUser()).thenReturn(user);
        when(mapper.map(session)).thenReturn(dto);
        when(storage.getSignUpCount(dto.getId())).thenReturn(2);
        when(storage.getMaxPlayers(dto.getId())).thenReturn(8);
        when(signUpStorage.existsByUserIdAndSessionId(user.getId(), session.getId())).thenReturn(true);
        when(bookingStorage.existsByUserAndSession(user, session)).thenReturn(false);

        Page<SessionReadDto> result = service.search(criteria, pageable);

        assertEquals(1, result.getTotalElements());
        verify(dto).setSignUpCount(2);
        verify(dto).setMaxPlayers(8);
        verify(dto).setSignedUp(true);
        verify(dto).setBooked(false);
    }

    @Test
    void search_userNotFound_success() {
        Pageable pageable = PageRequest.of(0, 10);
        SearchCriteriaDto criteria = mock(SearchCriteriaDto.class);
        Session session = mock(Session.class);
        Specification specification = mock(Specification.class);
        SessionReadDto dto = mock(SessionReadDto.class);

        when(searchMapper.map(criteria)).thenReturn(specification);
        when(storage.findAll(specification, pageable)).thenReturn(new PageImpl<>(List.of(session)));
        when(userService.getCurrentUser()).thenThrow(new UserNotFoundException(""));
        when(mapper.map(session)).thenReturn(dto);
        when(storage.getSignUpCount(dto.getId())).thenReturn(0);
        when(storage.getMaxPlayers(dto.getId())).thenReturn(0);

        Page<SessionReadDto> result = service.search(criteria, pageable);

        assertEquals(1, result.getTotalElements());
        verify(dto).setSignedUp(false);
        verify(dto).setBooked(false);
    }

    // ---------- create ----------

    @Test
    void create_success() {
        SessionCreateDto createDto = mock(SessionCreateDto.class);
        FootballField field = mock(FootballField.class);
        User user = mock(User.class);
        Session session = mock(Session.class);
        SessionReadDto dto = mock(SessionReadDto.class);
        Company company = mock(Company.class);

        when(createDto.getFieldId()).thenReturn(10);
        when(footballFieldStorage.findById(10)).thenReturn(field);
        when(field.getCompany()).thenReturn(company);
        when(userService.getCurrentUser()).thenReturn(user);
        when(fieldAdminService.exists(user.getId(), company.getId())).thenReturn(true);
        when(createDto.getBookingPrice()).thenReturn(100);
        when(createDto.getSignUpPrice()).thenReturn(50);
        when(createDto.getMinPlayers()).thenReturn(5);
        when(createDto.getStartsAt()).thenReturn(ZonedDateTime.now());

        when(storage.save(any(Session.class))).thenReturn(session);
        when(mapper.map(session)).thenReturn(dto);

        SessionReadDto result = service.create(createDto);

        assertNotNull(result);
    }

    @Test
    void create_accessDenied() {
        SessionCreateDto createDto = mock(SessionCreateDto.class);
        FootballField field = mock(FootballField.class);
        User user = mock(User.class);
        Company company = mock(Company.class);

        when(createDto.getFieldId()).thenReturn(10);
        when(footballFieldStorage.findById(10)).thenReturn(field);
        when(field.getCompany()).thenReturn(company);
        when(userService.getCurrentUser()).thenReturn(user);
        when(fieldAdminService.exists(user.getId(), company.getId())).thenReturn(false);

        assertThrows(AccessDeniedException.class, () -> service.create(createDto));
    }

    // ---------- delete ----------

    @Test
    void delete_success() {
        Session session = mock(Session.class);
        User user = mock(User.class);
        Company company = mock(Company.class);

        when(storage.findById(1)).thenReturn(session);
        when(userService.getCurrentUser()).thenReturn(user);
        when(session.getFootballField()).thenReturn(mock(FootballField.class));
        when(session.getFootballField().getCompany()).thenReturn(company);
        when(company.getId()).thenReturn(10);
        when(fieldAdminService.exists(user.getId(), 10)).thenReturn(true);

        service.delete(1);

        verify(storage).delete(session);
    }

    @Test
    void delete_accessDenied() {
        Session session = mock(Session.class);
        User user = mock(User.class);
        Company company = mock(Company.class);

        when(storage.findById(1)).thenReturn(session);
        when(userService.getCurrentUser()).thenReturn(user);
        when(session.getFootballField()).thenReturn(mock(FootballField.class));
        when(session.getFootballField().getCompany()).thenReturn(company);
        when(company.getId()).thenReturn(10);
        when(fieldAdminService.exists(user.getId(), 10)).thenReturn(false);

        assertThrows(AccessDeniedException.class, () -> service.delete(1));
        verify(storage, never()).delete(any());
    }

    // ---------- edit ----------

    @Test
    void edit_success() {
        int sessionId = 1;
        SessionEditDto editDto = mock(SessionEditDto.class);
        Session session = mock(Session.class);
        User user = mock(User.class);
        Company company = mock(Company.class);
        SessionReadDto dto = mock(SessionReadDto.class);

        when(storage.findById(sessionId)).thenReturn(session);
        when(userService.getCurrentUser()).thenReturn(user);
        when(session.getFootballField()).thenReturn(mock(FootballField.class));
        when(session.getFootballField().getCompany()).thenReturn(company);
        when(company.getId()).thenReturn(10);
        when(fieldAdminService.exists(user.getId(), 10)).thenReturn(true);

        when(editDto.getBookingPrice()).thenReturn(100);
        when(editDto.getSignUpPrice()).thenReturn(50);
        when(editDto.getMinPlayers()).thenReturn(5);

        when(storage.save(session)).thenReturn(session);
        when(mapper.map(session)).thenReturn(dto);

        SessionReadDto result = service.edit(sessionId, editDto);

        assertNotNull(result);
        verify(session).setBookingPrice(100);
        verify(session).setSignUpPrice(50);
        verify(session).setMinPlayers(5);
    }

    @Test
    void edit_accessDenied() {
        int sessionId = 1;
        SessionEditDto editDto = mock(SessionEditDto.class);
        Session session = mock(Session.class);
        User user = mock(User.class);
        Company company = mock(Company.class);

        when(storage.findById(sessionId)).thenReturn(session);
        when(userService.getCurrentUser()).thenReturn(user);
        when(session.getFootballField()).thenReturn(mock(FootballField.class));
        when(session.getFootballField().getCompany()).thenReturn(company);
        when(company.getId()).thenReturn(10);
        when(fieldAdminService.exists(user.getId(), 10)).thenReturn(false);

        assertThrows(AccessDeniedException.class, () -> service.edit(sessionId, editDto));
    }
}
