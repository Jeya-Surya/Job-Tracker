package com.jeyasurya.jobtrackerbackend.service;

import com.jeyasurya.jobtrackerbackend.dto.DashboardStatsDTO;
import com.jeyasurya.jobtrackerbackend.dto.WeeklyStatsDTO;
import com.jeyasurya.jobtrackerbackend.entity.ApplicationStatus;
import com.jeyasurya.jobtrackerbackend.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ApplicationRepository applicationRepository;

    public DashboardStatsDTO getDashboardStats(String email) {
        long total = applicationRepository.countByUserEmail(email);
        long applied = applicationRepository.countByUserEmailAndStatus(email, ApplicationStatus.APPLIED);
        long shortlisted = applicationRepository.countByUserEmailAndStatus(email, ApplicationStatus.SHORTLISTED);
        long interviews  = applicationRepository.countByUserEmailAndStatus(email, ApplicationStatus.INTERVIEW);
        long offers      = applicationRepository.countByUserEmailAndStatus(email, ApplicationStatus.OFFER);
        long rejected    = applicationRepository.countByUserEmailAndStatus(email, ApplicationStatus.REJECTED);

        double interviewRate = total > 0 ? Math.round((interviews * 100.0 / total) * 10.0) / 10.0 : 0;
        double offerRate = total > 0 ? Math.round((offers * 100.0 / total) * 10.0) / 10.0 : 0;

        return new DashboardStatsDTO(total, applied, shortlisted, interviews, offers, rejected, interviewRate, offerRate);
    }

    public List<WeeklyStatsDTO> getWeeklyStats(String email) {
        return applicationRepository.countApplicationsPerWeek(email)
                .stream()
                .map(row -> new WeeklyStatsDTO((String) row[0], (Long) row[1]))
                .collect(Collectors.toList());
    }
}
