package com.aditya.connexus.service;

import com.aditya.connexus.dto.UserDtos.AuthResponse;
import com.aditya.connexus.dto.UserDtos.LoginRequest;
import com.aditya.connexus.dto.UserDtos.RegisterRequest;
import com.aditya.connexus.dto.UserDtos.UserResponse;
import com.aditya.connexus.exception.UserExceptions.EmailAlreadyExistsException;
import com.aditya.connexus.exception.UserExceptions.InvalidCredentialsException;
import com.aditya.connexus.exception.UserExceptions.UserNotFoundException;
import com.aditya.connexus.model.User;
import com.aditya.connexus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final String STATUS_ACTIVE = "ACTIVE";
    private static final String STATUS_INACTIVE = "INACTIVE";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public UserResponse register(RegisterRequest request) {
        String email = normalize(request.email());
        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException();
        }

        // Build the entity from validated fields only, so clients can't set id, status or role
        User user = new User();
        user.setEmail(email);
        user.setUsername(resolveUsername(request.username(), email));
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setStatus(STATUS_INACTIVE); // registered, but not logged in yet
        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(normalize(request.email()))
                .filter(u -> passwordEncoder.matches(request.password(), u.getPassword()))
                .orElseThrow(InvalidCredentialsException::new);

        user.setStatus(STATUS_ACTIVE); // managed entity: flushed on commit, no explicit save needed

        return new AuthResponse(
                jwtService.generateToken(user),
                "Bearer",
                jwtService.getExpirationSeconds(),
                UserResponse.from(user));
    }

    @Transactional
    public void logout(String email) {
        User user = userRepository.findByEmail(normalize(email))
                .orElseThrow(UserNotFoundException::new);
        user.setStatus(STATUS_INACTIVE);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getUsers() {
        return userRepository.findAll().stream() // single query (the old code ran findAll twice)
                .map(UserResponse::from)
                .toList();
    }

    private static String resolveUsername(String requested, String email) {
        if (requested != null && !requested.isBlank()) {
            return requested.trim();
        }
        return email.substring(0, email.indexOf('@'));
    }

    private static String normalize(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}