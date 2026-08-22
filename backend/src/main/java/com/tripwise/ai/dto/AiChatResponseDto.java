package com.tripwise.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiChatResponseDto {
    private String response;
    private boolean actionSuggested;
    private String suggestedActionType;
    private List<String> suggestions;
}
