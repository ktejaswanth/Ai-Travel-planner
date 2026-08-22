export type TripStatus = 'DRAFT' | 'PLANNING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export type Interest =
  | 'BEACH'
  | 'ADVENTURE'
  | 'NATURE'
  | 'CULTURE'
  | 'HISTORY'
  | 'FOOD'
  | 'NIGHTLIFE'
  | 'SHOPPING'
  | 'PHOTOGRAPHY'
  | 'RELAXATION';

export interface TripPreference {
  interests: Interest[];
  travelStyle?: string;
  pace?: string;
  accommodationPreference?: string;
  transportPreference?: string;
  dietaryPreference?: string;
  specialRequirements?: string;
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  currency: string;
  status: TripStatus;
  preferences?: TripPreference;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTripRequest {
  title?: string;
  origin?: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  currency?: string;
  preferences?: TripPreference;
}

export interface UpdateTripRequest {
  title?: string;
  origin?: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  currency?: string;
  status?: TripStatus;
  preferences?: TripPreference;
}

export interface ActivityItem {
  id?: string;
  title: string;
  description: string;
  locationName: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  estimatedCost: number;
  currency: string;
  category: string;
  orderIndex: number;
}

export interface DayPlan {
  id?: string;
  dayNumber: number;
  date: string;
  title: string;
  summary: string;
  activities: ActivityItem[];
}

export interface BudgetPlan {
  id?: string;
  tripId: string;
  totalBudget: number;
  currency: string;
  flightAllocation: number;
  hotelAllocation: number;
  foodAllocation: number;
  activitiesAllocation: number;
  transportAllocation: number;
  emergencyBuffer: number;
  totalEstimated: number;
  remaining: number;
  utilizationPercentage: number;
}

export interface LivePriceContext {
  origin: string;
  destination: string;
  currency: string;
  durationDays: number;
  travelers: number;
  totalBudget: number;
  flightEstimateTotal: number;
  hotelEstimateTotal: number;
  hotelPerNight: number;
  estimatedFoodTotal: number;
  estimatedActivitiesTotal: number;
  estimatedTransportTotal: number;
  emergencyBuffer: number;
  remainingForActivitiesAndFood: number;
  dailyBudgetCap: number;
}

export interface ItineraryResponse {
  tripId: string;
  days: DayPlan[];
  budgetPlan: BudgetPlan;
  pricingContext: LivePriceContext;
}

