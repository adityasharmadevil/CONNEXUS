package com.iilm.CONNEXUS.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;

@RestController
public class HealthCheck {

    @GetMapping("api/hello")
    public ResponseEntity<String> healthCheck(HttpServletResponse response) {
        // Manually setting CORS headers
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
        response.setHeader("Access-Control-Allow-Headers", "*");

        // Log message to the console (useful for backend debugging)
        System.out.println("Backend is active");

        // Return a response entity with a message
        return ResponseEntity.ok("Backend is active");
    }
}
