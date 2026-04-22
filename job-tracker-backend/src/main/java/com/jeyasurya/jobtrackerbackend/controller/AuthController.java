package com.jeyasurya.jobtrackerbackend.controller;

import com.jeyasurya.jobtrackerbackend.dto.LoginRequestDTO;
import com.jeyasurya.jobtrackerbackend.dto.RegisterRequestDTO;
import com.jeyasurya.jobtrackerbackend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid
                                          @RequestBody RegisterRequestDTO registerRequestDTO) {
        String message = authService.register(registerRequestDTO);
        return ResponseEntity.ok(Map.of("message", message));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody LoginRequestDTO loginRequestDTO) {
        String token = authService.login(loginRequestDTO);
        String username = authService.getUsernameByEmail(loginRequestDTO.getEmail());
        return ResponseEntity.ok(Map.of("token", token, "username", username));
    }
}
