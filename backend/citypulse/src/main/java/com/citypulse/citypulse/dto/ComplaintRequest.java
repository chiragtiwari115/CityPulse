package com.citypulse.citypulse.dto;

import com.citypulse.citypulse.enums.ComplaintCategory;
import com.citypulse.citypulse.enums.ComplaintSeverity;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ComplaintRequest(
        @NotNull(message = "Category is required")
        ComplaintCategory category,

        @NotNull(message = "Severity is required")
        ComplaintSeverity severity,

        @NotBlank(message = "Title is required")
        @Size(max = 255, message = "Title must be 255 characters or less")
        String title,

        @NotBlank(message = "Description is required")
        @Size(max = 2000, message = "Description must be 2000 characters or less")
        String description,

        @NotBlank(message = "Contact name is required")
        @Size(max = 150, message = "Contact name must be 150 characters or less")
        String contactName,

        @NotBlank(message = "Contact phone is required")
        @Size(max = 50, message = "Contact phone must be 50 characters or less")
        String contactPhone,

        @Email(message = "Please provide a valid contact email")
        @NotBlank(message = "Contact email is required")
        @Size(max = 150, message = "Contact email must be 150 characters or less")
        String contactEmail,

        @Size(max = 500, message = "Address must be 500 characters or less")
        String address,

        @NotNull(message = "Latitude is required")
        Double latitude,

        @NotNull(message = "Longitude is required")
        Double longitude) {
}

