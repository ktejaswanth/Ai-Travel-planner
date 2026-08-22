package com.tripwise.ai.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.regex.Pattern;

@Slf4j
@Component
public class PromptSanitizer {

    private static final int MAX_INPUT_LENGTH = 1000;

    // Pattern list for detecting typical prompt injection and system override attempts
    private static final List<Pattern> INJECTION_PATTERNS = List.of(
            Pattern.compile("(?i)(ignore|disregard|forget|bypass)\\s+(all\\s+)?(previous|prior|above)\\s+(instructions|prompts|rules|commands)"),
            Pattern.compile("(?i)(you\\s+are\\s+now|act\\s+as|pretend\\s+to\\s+be)\\s+(a|an)?\\s*(developer|system|root|admin|dan|jailbreak|unrestricted)"),
            Pattern.compile("(?i)(system\\s*:|user\\s*:|assistant\\s*:|<\\|im_start\\|>|<\\|im_end\\|>|```system)"),
            Pattern.compile("(?i)(do\\s+anything\\s+now|jailbroken|unfiltered\\s+mode|developer\\s+mode)"),
            Pattern.compile("(?i)(reveal|show|print|output|display)\\s+(your|the)?\\s*(system\\s+prompt|secret|instructions|hidden\\s+rules)"),
            Pattern.compile("(?i)<script[\\s\\S]*?>[\\s\\S]*?<\\/script>"),
            Pattern.compile("(?i)(javascript:|onerror=|onload=)")
    );

    /**
     * Sanitizes a single free-text user field to remove prompt injection tokens,
     * escape delimiters, and truncate to maximum safe length.
     */
    public String sanitize(String input) {
        if (input == null || input.isBlank()) {
            return "";
        }

        String cleaned = input.trim();

        // Enforce maximum length constraint
        if (cleaned.length() > MAX_INPUT_LENGTH) {
            log.warn("User input exceeded max length ({}), truncating", cleaned.length());
            cleaned = cleaned.substring(0, MAX_INPUT_LENGTH);
        }

        // Check and neutralize prompt injection attempts
        for (Pattern pattern : INJECTION_PATTERNS) {
            if (pattern.matcher(cleaned).find()) {
                log.warn("Potential prompt injection pattern detected and neutralized: {}", pattern.pattern());
                cleaned = pattern.matcher(cleaned).replaceAll("[FILTERED]");
            }
        }

        // Neutralize delimiters that could escape XML/JSON context boundaries
        cleaned = cleaned.replace("```", "'''")
                         .replace("<traveler_input>", "")
                         .replace("</traveler_input>", "")
                         .replace("<system_override>", "")
                         .replace("</system_override>", "");

        return cleaned.trim();
    }

    /**
     * Encloses sanitized user data within rigid semantic XML boundary tags
     * that LLMs treat strictly as data, not instructions.
     */
    public String wrapInDataBoundary(String tagName, String rawInput) {
        String sanitized = sanitize(rawInput);
        return String.format("<%s>\n%s\n</%s>", tagName, sanitized, tagName);
    }
}
