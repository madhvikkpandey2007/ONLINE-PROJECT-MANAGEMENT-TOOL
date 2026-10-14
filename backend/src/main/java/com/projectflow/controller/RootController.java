package com.projectflow.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class RootController {

    @GetMapping(value = {"/", "/api", "/api/health"})
    public ResponseEntity<Map<String, Object>> getApiStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("application", "ProjectFlow Backend API");
        status.put("version", "1.0.0");
        status.put("message", "REST API is running successfully");
        status.put("swaggerDocs", "/swagger-ui.html");
        status.put("h2Console", "/h2-console");
        status.put("frontendUrl", "http://localhost:5173");
        return ResponseEntity.ok(status);
    }
}
