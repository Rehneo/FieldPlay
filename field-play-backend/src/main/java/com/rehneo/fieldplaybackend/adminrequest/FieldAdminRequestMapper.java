package com.rehneo.fieldplaybackend.adminrequest;

import com.rehneo.fieldplaybackend.user.User;
import com.rehneo.fieldplaybackend.user.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FieldAdminRequestMapper {
    private final UserMapper userMapper;

    public FieldAdminRequestReadDto map(FieldAdminRequest adminRequest) {
        FieldAdminRequestReadDto readDto = FieldAdminRequestReadDto.builder()
                .id(adminRequest.getId())
                .user(userMapper.map(adminRequest.getUser()))
                .companyId(adminRequest.getCompany().getId())
                .companyName(adminRequest.getCompany().getName())
                .createdAt(adminRequest.getCreatedAt())
                .status(adminRequest.getStatus())
                .approvedAt(adminRequest.getApprovedAt())
                .build();

        User user = adminRequest.getApprovedBy();
        if (user != null) {
            readDto.setApprovedBy(userMapper.map(user));
        }
        return readDto;
    }
}
