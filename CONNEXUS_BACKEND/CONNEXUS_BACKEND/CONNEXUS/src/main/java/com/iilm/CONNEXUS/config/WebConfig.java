package com.iilm.CONNEXUS.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // Allow CORS requests from the frontend URL
                registry.addMapping("/api/**")  // applies to all endpoints under /api/*
                        .allowedOrigins("http://localhost:5173")  // Allow localhost:5173 for frontend
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")  // Allow these HTTP methods
                        .allowedHeaders("*")  // Allow all headers from the client
                        .allowCredentials(true);  // Allow credentials (cookies, authorization headers, etc.)
            }
        };
    }
}
