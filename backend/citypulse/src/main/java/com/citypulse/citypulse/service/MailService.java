package com.citypulse.citypulse.service;

import com.citypulse.citypulse.entity.Complaint;
import com.citypulse.citypulse.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;

    public void sendComplaintSubmissionEmail(Complaint complaint) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(resolveRecipients(complaint));
            message.setSubject("CityPulse — we received your complaint");
            String contactName = StringUtils.hasText(complaint.getContactName()) 
                    ? complaint.getContactName() 
                    : "Valued Citizen";
            String location = StringUtils.hasText(complaint.getAddress())
                    ? complaint.getAddress()
                    : String.format(
                            "Lat/Lng: %.6f, %.6f",
                            complaint.getLatitude() != null ? complaint.getLatitude().doubleValue() : 0.0,
                            complaint.getLongitude() != null ? complaint.getLongitude().doubleValue() : 0.0);
            message.setText("""
                    Hi %s,

                    Thanks for letting us know about "%s". Our team will take a look and keep you posted on the next steps.

                    Category: %s
                    Severity: %s
                    Location: %s

                    We appreciate your help keeping the city running smoothly.

                    — CityPulse Team
                    """.formatted(
                    contactName,
                    complaint.getTitle(),
                    complaint.getCategory() != null ? complaint.getCategory().name() : "N/A",
                    complaint.getSeverity() != null ? complaint.getSeverity().name() : "N/A",
                    location));
            mailSender.send(message);
        } catch (Exception ex) {
            // Log error but don't fail the complaint submission
            // In production, use a proper logger
            System.err.println("Failed to send complaint submission email: " + ex.getMessage());
        }
    }

    public void sendStatusUpdateEmail(Complaint complaint, User updatedBy) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(resolveRecipients(complaint));
            message.setSubject("CityPulse — update on your complaint \"" + complaint.getTitle() + "\"");
            String contactName = StringUtils.hasText(complaint.getContactName()) 
                    ? complaint.getContactName() 
                    : "Valued Citizen";
            String updatedByUsername = updatedBy != null && StringUtils.hasText(updatedBy.getUsername())
                    ? updatedBy.getUsername()
                    : "CityPulse Team";
            message.setText("""
                    Hi %s,

                    Your complaint "%s" has been updated to: %s.

                    Notes from the team: %s

                    Updated by: %s

                    We will keep you informed as we make progress.

                    — CityPulse Team
                    """.formatted(
                    contactName,
                    complaint.getTitle(),
                    complaint.getStatus() != null ? complaint.getStatus().name() : "N/A",
                    StringUtils.hasText(complaint.getStatusNotes()) ? complaint.getStatusNotes() : "No additional notes provided.",
                    updatedByUsername));
            mailSender.send(message);
        } catch (Exception ex) {
            // Log error but don't fail the status update
            // In production, use a proper logger
            System.err.println("Failed to send status update email: " + ex.getMessage());
        }
    }

    private String[] resolveRecipients(Complaint complaint) {
        String contactEmail = complaint.getContactEmail();
        if (!StringUtils.hasText(contactEmail) && complaint.getUser() != null) {
            contactEmail = complaint.getUser().getEmail();
        }
        if (!StringUtils.hasText(contactEmail)) {
            throw new IllegalArgumentException("No email address available for complaint notification");
        }
        if (complaint.getUser() != null
                && StringUtils.hasText(complaint.getUser().getEmail())
                && !contactEmail.equalsIgnoreCase(complaint.getUser().getEmail())) {
            return new String[]{contactEmail, complaint.getUser().getEmail()};
        }
        return new String[]{contactEmail};
    }
}

