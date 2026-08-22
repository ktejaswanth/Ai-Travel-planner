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
