package com.citypulse.citypulse.dto;

import com.citypulse.citypulse.enums.ComplaintCategory;
import com.citypulse.citypulse.enums.ComplaintSeverity;
import com.citypulse.citypulse.enums.ComplaintStatus;
import java.math.BigDecimal;
import java.time.Instant;

public record ComplaintResponse(
        Long id,
        ComplaintCategory category,
        ComplaintSeverity severity,
        ComplaintStatus status,
        String title,
        String description,
        String contactName,
        String contactPhone,
        String contactEmail,
        String address,
        BigDecimal latitude,
        BigDecimal longitude,
        String statusNotes,
        Instant createdAt,
        Instant updatedAt,
        UserDto reporter) {
}

