package com.aditya.connexus.controller;

import com.aditya.connexus.dto.UserDtos.AuthResponse;
import com.aditya.connexus.dto.UserDtos.LoginRequest;
import com.aditya.connexus.dto.UserDtos.RegisterRequest;
import com.aditya.connexus.dto.UserDtos.UserResponse;
import com.aditya.connexus.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.debug("Register request received");
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.debug("Login request received");
        return ResponseEntity.ok(userService.login(request));
    }

    // The user comes from the verified JWT, so nobody can log out someone else by passing their email
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(@AuthenticationPrincipal Jwt jwt) {
        userService.logout(jwt.getSubject());
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getUsers() {
        return ResponseEntity.ok(userService.getUsers());
    }
}