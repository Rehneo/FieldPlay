package com.rehneo.fieldplaybackend.booking;

import com.rehneo.fieldplaybackend.blacklist.BlackListStorage;
import com.rehneo.fieldplaybackend.companies.Company;
import com.rehneo.fieldplaybackend.error.AccessDeniedException;
import com.rehneo.fieldplaybackend.footballfield.data.FootballField;
import com.rehneo.fieldplaybackend.session.Session;
import com.rehneo.fieldplaybackend.session.SessionStorage;
import com.rehneo.fieldplaybackend.user.User;
import com.rehneo.fieldplaybackend.user.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {
    @Mock
    BookingMapper mapper;
    @Mock
    SessionStorage sessionStorage;
    @Mock
    BlackListStorage blackListStorage;
    @Mock
    UserService userService;
    @Mock
    BookingStorage storage;

    @InjectMocks
    BookingService service;

    // ---------- book ----------

    @Test
    void book_success() {
        int sessionId = 1;
        int companyId = 10;

        Session session = mock(Session.class);
        FootballField field = mock(FootballField.class);
        Company company = mock(Company.class);
        User user = mock(User.class);
        BookingReadDto dto = mock(BookingReadDto.class);

        when(sessionStorage.findById(sessionId)).thenReturn(session);
        when(session.getFootballField()).thenReturn(field);
        when(field.getCompany()).thenReturn(company);
        when(company.getId()).thenReturn(companyId);

        when(userService.getCurrentUser()).thenReturn(user);
        when(user.getId()).thenReturn(1);

        when(blackListStorage.existsByUserIdAndCompanyId(1, companyId))
                .thenReturn(false);

        when(userService.getBalanceByUser(user)).thenReturn(100);
        when(mapper.map(any(Booking.class))).thenReturn(dto);

        BookingReadDto result = service.book(sessionId);

        assertNotNull(result);
        verify(storage).save(any(Booking.class));
        verify(user).setBalance(100);
    }

    @Test
    void book_userInBlacklist_accessDenied() {
        int sessionId = 1;
        int companyId = 10;

        Session session = mock(Session.class);
        FootballField field = mock(FootballField.class);
        Company company = mock(Company.class);
        User user = mock(User.class);

        when(sessionStorage.findById(sessionId)).thenReturn(session);
        when(session.getFootballField()).thenReturn(field);
        when(field.getCompany()).thenReturn(company);
        when(company.getId()).thenReturn(companyId);

        when(userService.getCurrentUser()).thenReturn(user);
        when(user.getId()).thenReturn(1);

        when(blackListStorage.existsByUserIdAndCompanyId(1, companyId))
                .thenReturn(true);

        assertThrows(
                AccessDeniedException.class,
                () -> service.book(sessionId)
        );

        verify(storage, never()).save(any());
    }

    // ---------- findMy ----------

    @Test
    void findMy_success() {
        int sessionId = 1;

        Session session = mock(Session.class);
        User user = mock(User.class);
        Booking booking = mock(Booking.class);
        BookingReadDto dto = mock(BookingReadDto.class);

        when(sessionStorage.findById(sessionId)).thenReturn(session);
        when(userService.getCurrentUser()).thenReturn(user);
        when(storage.findByUserAndSession(user, session)).thenReturn(booking);
        when(mapper.map(booking)).thenReturn(dto);

        BookingReadDto result = service.findMy(sessionId);

        assertNotNull(result);
        verify(storage).findByUserAndSession(user, session);
    }

    @Test
    void isUserBooked_true() {
        int sessionId = 1;

        Session session = mock(Session.class);
        User user = mock(User.class);

        when(sessionStorage.findById(sessionId)).thenReturn(session);
        when(userService.getCurrentUser()).thenReturn(user);
        when(storage.existsByUserAndSession(user, session)).thenReturn(true);

        boolean result = service.isUserBooked(sessionId);

        assertTrue(result);
    }

    @Test
    void isUserBooked_false() {
        int sessionId = 1;

        Session session = mock(Session.class);
        User user = mock(User.class);

        when(sessionStorage.findById(sessionId)).thenReturn(session);
        when(userService.getCurrentUser()).thenReturn(user);
        when(storage.existsByUserAndSession(user, session)).thenReturn(false);

        boolean result = service.isUserBooked(sessionId);

        assertFalse(result);
    }
}