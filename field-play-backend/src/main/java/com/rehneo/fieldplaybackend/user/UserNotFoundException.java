package com.rehneo.fieldplaybackend.user;

import com.rehneo.fieldplaybackend.error.ResourceNotFoundException;

public class UserNotFoundException extends ResourceNotFoundException {
    public UserNotFoundException(String message) {
        super(message);
    }
}
