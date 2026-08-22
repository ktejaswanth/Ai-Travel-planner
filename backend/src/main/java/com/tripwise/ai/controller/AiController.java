package com.tripwise.ai.controller;

import com.tripwise.ai.dto.AiChatRequestDto;
import com.tripwise.ai.dto.AiChatResponseDto;
import com.tripwise.ai.dto.AiReplanRequestDto;
import com.tripwise.ai.dto.AiReplanResponseDto;
import com.tripwise.ai.service.AiService;
import com.tripwise.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI Assistant & Replanning", description = "Gemini AI interactive assistant & adaptive replanning endpoints")
public class AiController {

    private final AiService aiService;

    @PostMapping("/chat")
    @Operation(summary = "Ask AI Assistant in-trip travel questions and suggestions")
    public ResponseEntity<ApiResponse<AiChatResponseDto>> chat(@RequestBody AiChatRequestDto request) {
        AiChatResponseDto response = aiService.chat(request);
        return ResponseEntity.ok(ApiResponse.success("AI response generated", response));
    }

    @PostMapping("/replan")
    @Operation(summary = "Generate adaptive replan comparison based on weather disruption or traveler preference")
    public ResponseEntity<ApiResponse<AiReplanResponseDto>> replan(@RequestBody AiReplanRequestDto request) {
        AiReplanResponseDto response = aiService.generateAdaptiveReplan(request);
        return ResponseEntity.ok(ApiResponse.success("Adaptive replan generated successfully", response));
    }
}
