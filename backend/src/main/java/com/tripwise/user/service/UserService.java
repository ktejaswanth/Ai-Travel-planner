package com.tripwise.user.service;

import com.tripwise.common.exception.DuplicateResourceException;
import com.tripwise.common.exception.ResourceNotFoundException;
import com.tripwise.user.dto.UpdateUserRequest;
import com.tripwise.user.dto.UserResponse;
import com.tripwise.user.model.User;
import com.tripwise.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse getUserById(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return mapToUserResponse(user);
    }

    public UserResponse updateUser(String userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (!user.getEmail().equalsIgnoreCase(request.getEmail()) &&
                userRepository.existsByEmail(request.getEmail().toLowerCase())) {
            throw new DuplicateResourceException("Email already in use: " + request.getEmail());
        }

        user.setName(request.getName());
        user.setEmail(request.getEmail().toLowerCase());

        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }

    public UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
