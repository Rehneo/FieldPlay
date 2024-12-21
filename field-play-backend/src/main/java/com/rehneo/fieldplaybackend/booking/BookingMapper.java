package com.rehneo.fieldplaybackend.booking;

import com.rehneo.fieldplaybackend.session.SessionMapper;
import com.rehneo.fieldplaybackend.signups.SignUp;
import com.rehneo.fieldplaybackend.signups.SignUpReadDto;
import com.rehneo.fieldplaybackend.user.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookingMapper {
    private final UserMapper userMapper;
    private final SessionMapper sessionMapper;

    public BookingReadDto map(Booking booking) {
        return BookingReadDto.builder()
                .id(booking.getId())
                .createdAt(booking.getCreatedAt())
                .session(sessionMapper.map(booking.getSession()))
                .user(userMapper.map(booking.getUser()))
                .build();
    }
}
