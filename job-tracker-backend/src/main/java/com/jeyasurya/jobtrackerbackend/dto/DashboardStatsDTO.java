package com.jeyasurya.jobtrackerbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDTO {

    private long totalApplications;
    private long applied;
    private long shortlisted;
    private long interviews;
    private long offers;
    private long rejected;
    private double interviewRate;
    private double offerRate;
}
