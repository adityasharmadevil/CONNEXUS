package com.aditya.connexus.dto;

import com.aditya.connexus.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class UserDtos {

    private UserDtos() {}

    public record RegisterRequest(
            @Size(max = 50) String username, // optional
            @NotBlank @Email @Size(max = 254) String email,
            // BCrypt only uses the first 72 bytes, so cap the length
            @NotBlank @Size(min = 8, max = 72, message = "must be between 8 and 72 characters") String password
    ) {}

    public record LoginRequest(
            @NotBlank @Email String email,
            @NotBlank String password
    ) {}

    /** Public view of a user. Never exposes the password hash. */
    public record UserResponse(Long id, String username, String email, String status) {
        public static UserResponse from(User user) {
            return new UserResponse(user.getId(), user.getUsername(), user.getEmail(), user.getStatus());
        }
    }

    public record AuthResponse(String accessToken, String tokenType, long expiresIn, UserResponse user) {}
}