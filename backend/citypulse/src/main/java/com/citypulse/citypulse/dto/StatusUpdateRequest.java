package com.citypulse.citypulse.dto;

import com.citypulse.citypulse.enums.ComplaintStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record StatusUpdateRequest(
        @NotNull(message = "Status is required")
        ComplaintStatus status,

        @Size(max = 500, message = "Notes must be 500 characters or less")
        String notes) {
}

