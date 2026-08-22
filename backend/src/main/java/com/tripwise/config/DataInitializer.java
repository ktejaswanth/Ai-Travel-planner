package com.tripwise.config;

import com.tripwise.auth.model.Role;
import com.tripwise.user.model.User;
import com.tripwise.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String demoEmail = "demo@tripwise.ai";
        if (!userRepository.existsByEmail(demoEmail)) {
            User demoUser = User.builder()
                    .name("Demo Traveler")
                    .email(demoEmail)
                    .passwordHash(passwordEncoder.encode("Password123!"))
                    .role(Role.USER)
                    .build();
            userRepository.save(demoUser);
            log.info("Initialized default demo user account: {}", demoEmail);
        }
    }
}
