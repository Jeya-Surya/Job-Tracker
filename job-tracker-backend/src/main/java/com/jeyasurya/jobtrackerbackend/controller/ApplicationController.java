package com.jeyasurya.jobtrackerbackend.controller;

import com.jeyasurya.jobtrackerbackend.dto.ApplicationRequestDTO;
import com.jeyasurya.jobtrackerbackend.dto.ApplicationResponseDTO;
import com.jeyasurya.jobtrackerbackend.service.ApplicationService;
import com.jeyasurya.jobtrackerbackend.service.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;
    private final JwtService jwtService;

    // Extract email from JWT token header
    private String getEmailFromToken(String authHeader) {
        String token = authHeader.substring(7);
        return jwtService.extractEmail(token);
    }

    @PostMapping
    public ResponseEntity<ApplicationResponseDTO> create(
            @Valid @RequestBody ApplicationRequestDTO request,
            @RequestHeader("Authorization") String authHeader) {
        String email = getEmailFromToken(authHeader);
        return new ResponseEntity<>(applicationService.create(request, email), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ApplicationResponseDTO>> getAll(@RequestHeader("Authorization") String authHeader) {
        String email = getEmailFromToken(authHeader);
        return ResponseEntity.ok(applicationService.getAll(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationResponseDTO> getById(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        String email = getEmailFromToken(authHeader);
        return ResponseEntity.ok(applicationService.getById(id, email));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApplicationResponseDTO> update(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody ApplicationRequestDTO request) {
        String email = getEmailFromToken(authHeader);
        return ResponseEntity.ok(applicationService.update(id, email, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        String email = getEmailFromToken(authHeader);
        return ResponseEntity.ok(applicationService.delete(id, email));
    }
}


