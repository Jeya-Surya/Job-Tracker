package com.jeyasurya.jobtrackerbackend.controller;

import com.jeyasurya.jobtrackerbackend.dto.DashboardStatsDTO;
import com.jeyasurya.jobtrackerbackend.dto.WeeklyStatsDTO;
import com.jeyasurya.jobtrackerbackend.service.AnalyticsService;
import com.jeyasurya.jobtrackerbackend.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final JwtService jwtService;

    private String getEmailFromToken(String authHeader) {
        String token = authHeader.substring(7);
        return jwtService.extractEmail(token);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDTO> getDashBoardStats(@RequestHeader("Authorization") String authHeader) {
        String email = getEmailFromToken(authHeader);
        return ResponseEntity.ok(analyticsService.getDashboardStats(email));
    }

    @GetMapping("/weekly")
    public ResponseEntity<List<WeeklyStatsDTO>> getWeeklyStats(@RequestHeader("Authorization") String authHeader) {
        String email = getEmailFromToken(authHeader);
        return ResponseEntity.ok(analyticsService.getWeeklyStats(email));
    }
}
