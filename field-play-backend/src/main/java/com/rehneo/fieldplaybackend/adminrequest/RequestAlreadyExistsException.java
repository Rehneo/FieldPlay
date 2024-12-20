package com.rehneo.fieldplaybackend.adminrequest;

import com.rehneo.fieldplaybackend.error.ConflictException;

public class RequestAlreadyExistsException extends ConflictException {
    public RequestAlreadyExistsException(String message) {
        super(message);
    }
}
