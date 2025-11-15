package com.citypulse.citypulse.service;

import com.citypulse.citypulse.dto.AuthResponse;
import com.citypulse.citypulse.entity.User;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class Auth0Service {

    private static final Logger log = LoggerFactory.getLogger(Auth0Service.class);

    private final RestTemplateBuilder restTemplateBuilder;
    private final UserService userService;
    private final AuthService authService;

    @Value("${auth0.domain}")
    private String domain;

    @Value("${auth0.client-id}")
    private String clientId;

    @Value("${auth0.client-secret}")
    private String clientSecret;

    @Value("${auth0.callback-url}")
    private String callbackUrl;

    public AuthResponse handleCallback(String code) {
        RestTemplate restTemplate = restTemplateBuilder.build();
        String tokenEndpoint = "https://" + domain + "/oauth/token";

        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("grant_type", "authorization_code");
        requestBody.add("client_id", clientId);
        requestBody.add("client_secret", clientSecret);
        requestBody.add("code", code);
        requestBody.add("redirect_uri", callbackUrl);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(requestBody, headers);

        Auth0TokenResponse tokenResponse;
        try {
            tokenResponse = restTemplate.postForObject(tokenEndpoint, entity, Auth0TokenResponse.class);
        } catch (RestClientException ex) {
            log.error("Failed to exchange Auth0 authorization code", ex);
            throw new IllegalArgumentException("Unable to complete Auth0 login. Please try again.");
        }

        if (tokenResponse == null || tokenResponse.accessToken() == null) {
            throw new IllegalArgumentException("Invalid Auth0 token response.");
        }

        Auth0UserInfo userInfo = fetchUserInfo(restTemplate, tokenResponse.accessToken());
        if (userInfo == null || userInfo.email() == null) {
            throw new IllegalArgumentException("Unable to retrieve user information from Auth0.");
        }

        User user = userService.upsertAuth0User(userInfo.sub(), userInfo.email(), resolveName(userInfo));
        return authService.buildAuthResponse(user);
    }

    private Auth0UserInfo fetchUserInfo(RestTemplate restTemplate, String accessToken) {
        String userInfoEndpoint = "https://" + domain + "/userinfo";
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        try {
            return restTemplate.exchange(userInfoEndpoint, HttpMethod.GET, entity, Auth0UserInfo.class)
                    .getBody();
        } catch (RestClientException ex) {
            log.error("Failed to fetch Auth0 user profile", ex);
            throw new IllegalArgumentException("Unable to retrieve Auth0 user profile.");
        }
    }

    private String resolveName(Auth0UserInfo userInfo) {
        if (userInfo.name() != null && !userInfo.name().isBlank()) {
            return userInfo.name();
        }
        if (userInfo.nickname() != null && !userInfo.nickname().isBlank()) {
            return userInfo.nickname();
        }
        return userInfo.email();
    }

    private record Auth0TokenResponse(
            String access_token,
            String id_token,
            String refresh_token,
            String scope,
            String token_type,
            Integer expires_in) {

        public String accessToken() {
            return access_token;
        }
    }

    private record Auth0UserInfo(
            String sub,
            String email,
            Boolean email_verified,
            String name,
            String nickname,
            Map<String, Object> extra) {}
}

