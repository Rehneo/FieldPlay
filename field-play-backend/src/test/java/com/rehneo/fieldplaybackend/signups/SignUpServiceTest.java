package com.rehneo.fieldplaybackend.signups;

import com.rehneo.fieldplaybackend.blacklist.BlackListStorage;
import com.rehneo.fieldplaybackend.companies.Company;
import com.rehneo.fieldplaybackend.error.AccessDeniedException;
import com.rehneo.fieldplaybackend.error.BadRequestException;
import com.rehneo.fieldplaybackend.footballfield.data.FootballField;
import com.rehneo.fieldplaybackend.session.*;
import com.rehneo.fieldplaybackend.user.User;
import com.rehneo.fieldplaybackend.user.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SignUpServiceTest {
    @Mock
    SignUpStorage storage;
    @Mock
    SessionStorage sessionStorage;
    @Mock
    UserService userService;
    @Mock
    SignUpMapper mapper;
    @Mock
    BlackListStorage blackListStorage;

    @InjectMocks
    SignUpService service;

    // ---------- signUp ----------

    @Test
    void signUp_success() {
        int sessionId = 1;
        Session session = mock(Session.class);
        User user = mock(User.class);
        SignUpReadDto dto = mock(SignUpReadDto.class);
        FootballField field = mock(FootballField.class);
        Company company = mock(Company.class);

        when(sessionStorage.findById(sessionId)).thenReturn(session);
        when(userService.getCurrentUser()).thenReturn(user);
        when(session.getFootballField()).thenReturn(field);
        when(field.getCompany()).thenReturn(company);
        when(user.getId()).thenReturn(1);

        when(blackListStorage.existsByUserIdAndCompanyId(1, company.getId()))
                .thenReturn(false);

        when(userService.getBalanceByUser(user)).thenReturn(100);
        when(mapper.map(any())).thenReturn(dto);

        SignUpReadDto result = service.signUp(sessionId);

        assertNotNull(result);
        verify(storage).save(any(SignUp.class));
        verify(user).setBalance(100);
    }

    @Test
    void signUp_blacklisted_accessDenied() {
        int sessionId = 1;
        Session session = mock(Session.class);
        User user = mock(User.class);
        FootballField field = mock(FootballField.class);
        Company company = mock(Company.class);

        when(sessionStorage.findById(sessionId)).thenReturn(session);
        when(userService.getCurrentUser()).thenReturn(user);
        when(session.getFootballField()).thenReturn(field);
        when(field.getCompany()).thenReturn(company);
        when(user.getId()).thenReturn(1);

        when(blackListStorage.existsByUserIdAndCompanyId(1, company.getId()))
                .thenReturn(true);

        assertThrows(
                AccessDeniedException.class,
                () -> service.signUp(sessionId)
        );

        verify(storage, never()).save(any());
    }

    // ---------- cancelSignUp ----------

    @Test
    void cancelSignUp_closedSession_badRequest() {
        int sessionId = 1;
        Session session = mock(Session.class);
        User user = mock(User.class);
        SignUp signUp = mock(SignUp.class);

        when(sessionStorage.findById(sessionId)).thenReturn(session);
        when(userService.getCurrentUser()).thenReturn(user);
        when(storage.findByUserAndSession(user, session)).thenReturn(signUp);
        when(session.getStatus()).thenReturn(Status.CLOSED);

        assertThrows(
                BadRequestException.class,
                () -> service.cancelSignUp(sessionId)
        );

        verify(storage, never()).delete(any());
    }

    // ---------- findMy ----------

    @Test
    void findMy_success() {
        int sessionId = 1;
        Session session = mock(Session.class);
        User user = mock(User.class);
        SignUp signUp = mock(SignUp.class);
        SignUpReadDto dto = mock(SignUpReadDto.class);

        when(sessionStorage.findById(sessionId)).thenReturn(session);
        when(userService.getCurrentUser()).thenReturn(user);
        when(storage.findByUserAndSession(user, session)).thenReturn(signUp);
        when(mapper.map(signUp)).thenReturn(dto);

        SignUpReadDto result = service.findMy(sessionId);

        assertNotNull(result);
    }

    // ---------- isUserSignedUp ----------

    @Test
    void isUserSignedUp_true() {
        int sessionId = 1;
        Session session = mock(Session.class);
        User user = mock(User.class);

        when(userService.getCurrentUser()).thenReturn(user);
        when(sessionStorage.findById(sessionId)).thenReturn(session);
        when(storage.existsByUserIdAndSessionId(user.getId(), session.getId())).thenReturn(true);

        assertTrue(service.isUserSignedUp(sessionId));
    }

    @Test
    void isUserSignedUp_false() {
        int sessionId = 1;
        Session session = mock(Session.class);
        User user = mock(User.class);

        when(userService.getCurrentUser()).thenReturn(user);
        when(sessionStorage.findById(sessionId)).thenReturn(session);
        when(storage.existsByUserIdAndSessionId(user.getId(), session.getId())).thenReturn(false);

        assertFalse(service.isUserSignedUp(sessionId));
    }
}
