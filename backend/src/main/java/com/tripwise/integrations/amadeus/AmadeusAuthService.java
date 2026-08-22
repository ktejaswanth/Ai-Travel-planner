package com.tripwise.integrations.amadeus;

import com.tripwise.integrations.config.IntegrationsProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;

@Slf4j
@Service
public class AmadeusAuthService {

    private final IntegrationsProperties.AmadeusProperties amadeusProperties;
    private final RestTemplate restTemplate;
    
    private String cachedToken = null;
    private Instant tokenExpiry = Instant.MIN;

    public AmadeusAuthService(IntegrationsProperties properties, RestTemplateBuilder builder) {
        this.amadeusProperties = properties.getAmadeus();
        this.restTemplate = builder
                .setConnectTimeout(Duration.ofSeconds(5))
                .setReadTimeout(Duration.ofSeconds(10))
                .build();
    }

    public synchronized String getAccessToken() {
        String clientId = amadeusProperties.getClientId();
        String clientSecret = amadeusProperties.getClientSecret();

        if (clientId == null || clientId.isBlank() || clientSecret == null || clientSecret.isBlank()) {
            log.debug("Amadeus client ID / secret not provided. Amadeus will run in fallback simulation mode.");
            return null;
        }

        if (cachedToken != null && Instant.now().isBefore(tokenExpiry.minusSeconds(60))) {
            return cachedToken;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("grant_type", "client_credentials");
            body.add("client_id", clientId);
            body.add("client_secret", clientSecret);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(amadeusProperties.getAuthUrl(), request, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> respBody = response.getBody();
                cachedToken = (String) respBody.get("access_token");
                int expiresIn = respBody.get("expires_in") instanceof Number ? ((Number) respBody.get("expires_in")).intValue() : 1799;
                tokenExpiry = Instant.now().plusSeconds(expiresIn);
                log.info("Successfully fetched and cached Amadeus OAuth2 token (expires in {}s)", expiresIn);
                return cachedToken;
            }
        } catch (Exception e) {
            log.error("Amadeus OAuth2 token request failed: {}", e.getMessage());
        }

        return null;
    }
}
