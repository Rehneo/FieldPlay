package com.rehneo.fieldplaybackend.auth;

import com.rehneo.fieldplaybackend.error.ConflictException;

public class UserAlreadyExistsException extends ConflictException {
    public UserAlreadyExistsException(String message) {
        super(message);
    }
}
