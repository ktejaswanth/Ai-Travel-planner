package com.tripwise.integrations.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "tripwise.integrations")
public class IntegrationsProperties {

    private GoogleProperties google = new GoogleProperties();
    private WeatherProperties weather = new WeatherProperties();
    private AmadeusProperties amadeus = new AmadeusProperties();
    private AviationstackProperties aviationstack = new AviationstackProperties();
    private GeminiProperties gemini = new GeminiProperties();

    @Data
    public static class GoogleProperties {
        private String mapsApiKey = "";
        private String placesApiKey = "";
    }

    @Data
    public static class WeatherProperties {
        private String openWeatherApiKey = "";
    }

    @Data
    public static class AmadeusProperties {
        private String clientId = "";
        private String clientSecret = "";
        private String authUrl = "https://test.api.amadeus.com/v1/security/oauth2/token";
        private String baseUrl = "https://test.api.amadeus.com";
    }

    @Data
    public static class AviationstackProperties {
        private String apiKey = "";
        private String baseUrl = "http://api.aviationstack.com/v1";
    }

    @Data
    public static class GeminiProperties {
        private String apiKey = "";
        private String model = "gemini-1.5-flash";
    }
}
