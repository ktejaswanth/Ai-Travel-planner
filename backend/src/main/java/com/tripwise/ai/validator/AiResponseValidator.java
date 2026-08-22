package com.tripwise.ai.validator;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AiResponseValidator {

    private final ObjectMapper objectMapper;

    public boolean isValidJson(String text) {
        if (text == null || text.isBlank()) return false;
        try {
            objectMapper.readTree(extractJsonFromMarkdown(text));
            return true;
        } catch (Exception e) {
            log.debug("AI output is not valid JSON: {}", e.getMessage());
            return false;
        }
    }

    public JsonNode parseAndValidateSchema(String text) {
        if (text == null || text.isBlank()) return null;
        try {
            String cleanedJson = extractJsonFromMarkdown(text);
            JsonNode root = objectMapper.readTree(cleanedJson);
            if (root.has("days") && root.get("days").isArray()) {
                return root;
            }
        } catch (Exception e) {
            log.warn("Failed schema validation on AI response: {}", e.getMessage());
        }
        return null;
    }

    public String extractJsonFromMarkdown(String text) {
        if (text == null) return "";
        String trimmed = text.trim();
        if (trimmed.startsWith("```json")) {
            trimmed = trimmed.substring(7);
        } else if (trimmed.startsWith("```")) {
            trimmed = trimmed.substring(3);
        }
        if (trimmed.endsWith("```")) {
            trimmed = trimmed.substring(0, trimmed.length() - 3);
        }
        return trimmed.trim();
    }
}
