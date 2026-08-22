package com.tripwise.integrations.pricing.service;

import com.tripwise.integrations.pricing.dto.CityCostProfile;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class CityCostIndexService {

    private final Map<String, CityCostProfile> cityProfiles = new HashMap<>();

    public CityCostIndexService() {
        initializeBenchmarkProfiles();
    }

    public CityCostProfile getCostProfile(String destination, String currency) {
        String key = destination.trim().toLowerCase();

        for (Map.Entry<String, CityCostProfile> entry : cityProfiles.entrySet()) {
            if (key.contains(entry.getKey())) {
                return entry.getValue();
            }
        }

        // Generic fallback profile for uncataloged destinations
        return generateDynamicFallback(destination, currency != null ? currency : "INR");
    }

    private void initializeBenchmarkProfiles() {
        // Goa, India
        cityProfiles.put("goa", CityCostProfile.builder()
                .cityName("Goa")
                .country("India")
                .currency("INR")
                .budgetMealAvg(250.0)
                .midRangeMealAvg(750.0)
                .coffeeAvg(120.0)
                .localTransportDay(400.0) // Scooter rental or local transit
                .taxiPerKm(35.0)
                .medianHostelRate(800.0)
                .medianHotel3StarRate(2800.0)
                .medianLuxuryResort(8500.0)
                .popularActivityPrices(Map.of(
                        "Scuba Diving & Boat Tour", 1800.0,
                        "Parasailing & Jet Ski Combo", 1500.0,
                        "Aguada Fort Entry", 50.0,
                        "Dudhsagar Waterfalls Trek", 1200.0,
                        "Mandovi River Cruise", 600.0
                ))
                .build());

        // Paris, France
        cityProfiles.put("paris", CityCostProfile.builder()
                .cityName("Paris")
                .country("France")
                .currency("EUR")
                .budgetMealAvg(15.0)
                .midRangeMealAvg(35.0)
                .coffeeAvg(4.0)
                .localTransportDay(9.0) // Paris Metro day pass
                .taxiPerKm(2.2)
                .medianHostelRate(40.0)
                .medianHotel3StarRate(130.0)
                .medianLuxuryResort(350.0)
                .popularActivityPrices(Map.of(
                        "Eiffel Tower Top Access", 29.0,
                        "Louvre Museum Ticket", 22.0,
                        "Seine River Cruise", 17.0,
                        "Palace of Versailles", 24.0
                ))
                .build());

        // Tokyo, Japan
        cityProfiles.put("tokyo", CityCostProfile.builder()
                .cityName("Tokyo")
                .country("Japan")
                .currency("JPY")
                .budgetMealAvg(1000.0)
                .midRangeMealAvg(3000.0)
                .coffeeAvg(450.0)
                .localTransportDay(800.0) // Tokyo Subway 24-hr Ticket
                .taxiPerKm(420.0)
                .medianHostelRate(4000.0)
                .medianHotel3StarRate(12000.0)
                .medianLuxuryResort(35000.0)
                .popularActivityPrices(Map.of(
                        "Tokyo Skytree Observatory", 2700.0,
                        "teamLab Planets Digital Art", 3800.0,
                        "Shibuya Sky Observation Deck", 2200.0,
                        "Ghibli Museum", 1000.0
                ))
                .build());

        // Dubai, UAE
        cityProfiles.put("dubai", CityCostProfile.builder()
                .cityName("Dubai")
                .country("United Arab Emirates")
                .currency("AED")
                .budgetMealAvg(40.0)
                .midRangeMealAvg(120.0)
                .coffeeAvg(22.0)
                .localTransportDay(25.0) // Nol card day pass
                .taxiPerKm(3.0)
                .medianHostelRate(90.0)
                .medianHotel3StarRate(300.0)
                .medianLuxuryResort(900.0)
                .popularActivityPrices(Map.of(
                        "Burj Khalifa 124th Floor", 179.0,
                        "Desert Safari with BBQ Dinner", 150.0,
                        "Dubai Aquarium & Underwater Zoo", 145.0,
                        "Museum of the Future", 149.0
                ))
                .build());

        // Bali, Indonesia
        cityProfiles.put("bali", CityCostProfile.builder()
                .cityName("Bali")
                .country("Indonesia")
                .currency("IDR")
                .budgetMealAvg(35000.0)
                .midRangeMealAvg(150000.0)
                .coffeeAvg(30000.0)
                .localTransportDay(70000.0) // Scooter rental per day
                .taxiPerKm(8000.0)
                .medianHostelRate(150000.0)
                .medianHotel3StarRate(500000.0)
                .medianLuxuryResort(2000000.0)
                .popularActivityPrices(Map.of(
                        "Uluwatu Sunset Kecak Dance", 150000.0,
                        "Mount Batur Sunrise Trek", 450000.0,
                        "Nusa Penida Island Tour", 650000.0,
                        "Tegallalang Rice Terrace & Swing", 200000.0
                ))
                .build());
    }

    private CityCostProfile generateDynamicFallback(String destination, String currency) {
        boolean isINR = "INR".equalsIgnoreCase(currency);
        double multiplier = isINR ? 1.0 : 0.012; // approximate conversion if USD/EUR

        return CityCostProfile.builder()
                .cityName(destination)
                .country("International/Domestic")
                .currency(currency)
                .budgetMealAvg(300.0 * multiplier)
                .midRangeMealAvg(800.0 * multiplier)
                .coffeeAvg(150.0 * multiplier)
                .localTransportDay(500.0 * multiplier)
                .taxiPerKm(30.0 * multiplier)
                .medianHostelRate(1000.0 * multiplier)
                .medianHotel3StarRate(3000.0 * multiplier)
                .medianLuxuryResort(9000.0 * multiplier)
                .popularActivityPrices(Map.of(
                        "City Landmark & Cultural Tour", 500.0 * multiplier,
                        "Local Sightseeing Admission", 200.0 * multiplier,
                        "Evening Entertainment & Dinner Experience", 1000.0 * multiplier
                ))
                .build();
    }
}
