package com.citypulse.citypulse.mapper;

import com.citypulse.citypulse.dto.UserDto;
import com.citypulse.citypulse.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDto toDto(User user) {
        if (user == null) {
            return null;
        }
        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name(),
                user.isAdmin(),
                user.getAuth0ProviderId() != null ? "auth0" : "local");
    }
}

