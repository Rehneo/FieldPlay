package com.rehneo.fieldplaybackend.error;

public class AccessDeniedException extends RuntimeException {
    AccessDeniedException(String message) {
        super(message);
    }
}
