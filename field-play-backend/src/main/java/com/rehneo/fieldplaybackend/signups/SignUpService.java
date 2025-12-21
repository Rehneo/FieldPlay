package com.rehneo.fieldplaybackend.signups;

import com.rehneo.fieldplaybackend.blacklist.BlackListStorage;
import com.rehneo.fieldplaybackend.error.AccessDeniedException;
import com.rehneo.fieldplaybackend.error.BadRequestException;
import com.rehneo.fieldplaybackend.session.*;
import com.rehneo.fieldplaybackend.user.User;
import com.rehneo.fieldplaybackend.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SignUpService {
    private final SignUpStorage storage;
    private final SessionStorage sessionStorage;
    private final UserService userService;
    private final SignUpMapper mapper;
    private final BlackListStorage blackListStorage;

    @Transactional
    public SignUpReadDto signUp(int sessionId) {
        Session session = sessionStorage.findById(sessionId);
        User currentUser = userService.getCurrentUser();
        if (blackListStorage.existsByUserIdAndCompanyId(
                currentUser.getId(),
                session.getFootballField().getCompany().getId()
        )) {
            throw new AccessDeniedException("Вы находитесь в черном списке данной компании");
        }
        SignUp signUp = SignUp.builder()
                .user(currentUser)
                .session(session)
                .build();
        storage.save(signUp);
        signUp.getUser().setBalance(userService.getBalanceByUser(currentUser));
        return mapper.map(signUp);
    }

    @Transactional
    public SignUpReadDto cancelSignUp(int sessionId) {
        Session session = sessionStorage.findById(sessionId);
        User user = userService.getCurrentUser();
        SignUp signUp = storage.findByUserAndSession(user, session);
        if (session.getStatus() == Status.CLOSED) {
            throw new BadRequestException("Нельзя отписаться от закрытой сессии");
        }
        storage.delete(signUp);
        SignUpReadDto dto = mapper.map(signUp);
        dto.getUser().setBalance(user.getBalance() + session.getSignUpPrice());
        return dto;
    }

    @Transactional
    public SignUpReadDto findMy(int sessionId) {
        Session session = sessionStorage.findById(sessionId);
        User user = userService.getCurrentUser();
        SignUp signUp = storage.findByUserAndSession(user, session);
        return mapper.map(signUp);
    }

    @Transactional
    public boolean isUserSignedUp(int sessionId) {
        User user = userService.getCurrentUser();
        Session session = sessionStorage.findById(sessionId);
        return storage.existsByUserIdAndSessionId(user.getId(), session.getId());
    }
}
