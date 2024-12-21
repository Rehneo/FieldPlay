package com.rehneo.fieldplaybackend.session;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SessionMapper {

    public SessionReadDto map(Session session) {
        return SessionReadDto.builder()
                .id(session.getId())
                .bookingPrice(session.getBookingPrice())
                .signUpPrice(session.getSignUpPrice())
                .minPlayers(session.getMinPlayers())
                .fieldName(session.getFootballField().getName())
                .fieldId(session.getFootballField().getId())
                .startsAt(session.getStartsAt())
                .status(session.getStatus())
                .build();
    }
}
