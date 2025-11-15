package com.citypulse.citypulse.mapper;

import com.citypulse.citypulse.dto.ComplaintResponse;
import com.citypulse.citypulse.entity.Complaint;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ComplaintMapper {

    private final UserMapper userMapper;

    public ComplaintResponse toDto(Complaint complaint) {
        if (complaint == null) {
            return null;
        }
        return new ComplaintResponse(
                complaint.getId(),
                complaint.getCategory(),
                complaint.getSeverity(),
                complaint.getStatus(),
                complaint.getTitle(),
                complaint.getDescription(),
                complaint.getContactName(),
                complaint.getContactPhone(),
                complaint.getContactEmail(),
                complaint.getAddress(),
                complaint.getLatitude(),
                complaint.getLongitude(),
                complaint.getStatusNotes(),
                complaint.getCreatedAt(),
                complaint.getUpdatedAt(),
                userMapper.toDto(complaint.getUser()));
    }
}

