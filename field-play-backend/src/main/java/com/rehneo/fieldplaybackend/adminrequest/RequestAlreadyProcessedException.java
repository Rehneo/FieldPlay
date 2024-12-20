package com.rehneo.fieldplaybackend.adminrequest;

import com.rehneo.fieldplaybackend.error.ConflictException;

public class RequestAlreadyProcessedException extends ConflictException {
    public RequestAlreadyProcessedException(String message) {
        super(message);
    }
}
