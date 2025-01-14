package com.rehneo.fieldplaybackend.signups;

import com.rehneo.fieldplaybackend.blacklist.BlackListRepository;
import com.rehneo.fieldplaybackend.error.AccessDeniedException;
import com.rehneo.fieldplaybackend.error.BadRequestException;
import com.rehneo.fieldplaybackend.error.ResourceNotFoundException;
import com.rehneo.fieldplaybackend.session.Session;
import com.rehneo.fieldplaybackend.session.SessionRepository;
import com.rehneo.fieldplaybackend.session.Status;
import com.rehneo.fieldplaybackend.user.User;
import com.rehneo.fieldplaybackend.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SignUpService {
    private final SignUpRepository repository;
    private final SessionRepository sessionRepository;
    private final UserService userService;
    private final SignUpMapper mapper;
    private final BlackListRepository blackListRepository;


    @Transactional
    public SignUpReadDto signUp(int sessionId) {
        Session session = sessionRepository.findById(sessionId).orElseThrow(
                () -> new ResourceNotFoundException("Сессия с id: " + sessionId + " не найдена")
        );
        User currentUser = userService.getCurrentUser();
        if (blackListRepository.existsByUserIdAndCompanyId(
                currentUser.getId(),
                session.getFootballField().getCompany().getId()
        )) {
            throw new AccessDeniedException("Вы находитесь в черном списке данной компании");
        }
        SignUp signUp = SignUp.builder()
                .user(currentUser)
                .session(session)
                .build();
        repository.save(signUp);
        signUp.getUser().setBalance(userService.getBalanceByUser(currentUser));
        return mapper.map(signUp);
    }

    @Transactional
    public SignUpReadDto cancelSignUp(int sessionId) {
        Session session = sessionRepository.findById(sessionId).orElseThrow(
                () -> new ResourceNotFoundException("Сессия с id: " + sessionId + " не найдена")
        );
        User user = userService.getCurrentUser();
        SignUp signUp = repository.findByUserAndSession(user, session).orElseThrow(
                () -> new ResourceNotFoundException("Вы не записаны на данную сессию")
        );
        if (session.getStatus() == Status.CLOSED) {
            throw new BadRequestException("Нельзя отписаться от закрытой сессии");
        }
        repository.delete(signUp);
        SignUpReadDto dto = mapper.map(signUp);
        dto.getUser().setBalance(user.getBalance() + session.getSignUpPrice());
        return dto;
    }

    @Transactional
    public SignUpReadDto findMy(int sessionId) {
        Session session = sessionRepository.findById(sessionId).orElseThrow(
                () -> new ResourceNotFoundException("Сессия с id: " + sessionId + " не найдена")
        );
        User user = userService.getCurrentUser();
        SignUp signUp = repository.findByUserAndSession(user, session).orElseThrow(
                () -> new ResourceNotFoundException("Вы не записаны на данную сессию")
        );
        return mapper.map(signUp);
    }

    @Transactional
    public boolean isUserSignedUp(int sessionId) {
        User user = userService.getCurrentUser();
        Session session = sessionRepository.findById(sessionId).orElseThrow(
                () -> new ResourceNotFoundException("Сессия с id: " + sessionId + " не найдена")
        );
        return repository.findByUserAndSession(user, session).isPresent();
    }
}
