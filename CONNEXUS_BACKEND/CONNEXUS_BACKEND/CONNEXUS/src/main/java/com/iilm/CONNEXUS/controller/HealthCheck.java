package com.iilm.CONNEXUS.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthCheck {

    @GetMapping("api/hello")
    public String healthCheck(){
        return "OK";
    }
}
