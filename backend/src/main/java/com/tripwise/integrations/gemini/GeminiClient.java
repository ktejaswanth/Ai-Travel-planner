package com.tripwise.integrations.gemini;

import java.util.Map;

public interface GeminiClient {

    String generateItineraryPrompt(Map<String, Object> tripDetails, Map<String, Object> preferences);

    String generateAIResponse(String prompt);
}
