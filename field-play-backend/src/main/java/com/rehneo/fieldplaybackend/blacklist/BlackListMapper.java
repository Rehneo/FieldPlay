package com.rehneo.fieldplaybackend.blacklist;

import com.rehneo.fieldplaybackend.user.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BlackListMapper {
    private final UserMapper userMapper;

    public BlackListReadDto map(BlackList blackList) {
        return BlackListReadDto.builder()
                .id(blackList.getId())
                .user(userMapper.map(blackList.getUser()))
                .companyId(blackList.getCompany().getId())
                .companyName(blackList.getCompany().getName())
                .reason(blackList.getReason())
                .createdAt(blackList.getCreatedAt())
                .build();
    }
}
