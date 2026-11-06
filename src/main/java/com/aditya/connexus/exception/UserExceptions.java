package com.aditya.connexus.exception;

public final class UserExceptions {

    private UserExceptions() {}

    public static class EmailAlreadyExistsException extends RuntimeException {
        public EmailAlreadyExistsException() {
            super("Email is already registered");
        }
    }

    public static class InvalidCredentialsException extends RuntimeException {
        public InvalidCredentialsException() {
            // Same message for unknown email and wrong password, to prevent account enumeration
            super("Invalid email or password");
        }
    }

    public static class UserNotFoundException extends RuntimeException {
        public UserNotFoundException() {
            super("User not found");
        }
    }
}