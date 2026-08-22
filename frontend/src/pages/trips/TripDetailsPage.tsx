import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Bot,
  Calendar,
  CloudSun,
  Compass,
  DollarSign,
  Hotel,
  Luggage,
  MapPin,
  Navigation,
  Plane,
  Sparkles,
  Users,
} from 'lucide-react';
import { tripService } from '../../services/tripService';
import { Trip } from '../../types/trip';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

type DetailTab =
  | 'Overview'
  | 'Itinerary'
  | 'Map'
  | 'Weather'
  | 'Flights'
  | 'Hotels'
  | 'Budget'
  | 'Packing'
  | 'AI Assistant';

const TABS: { id: DetailTab; label: string; icon: React.ReactNode }[] = [
  { id: 'Overview', label: 'Overview', icon: <Compass className="h-4 w-4" /> },
  { id: 'Itinerary', label: 'Itinerary', icon: <Calendar className="h-4 w-4" /> },
  { id: 'Map', label: 'Map & Places', icon: <Navigation className="h-4 w-4" /> },
  { id: 'Weather', label: 'Weather', icon: <CloudSun className="h-4 w-4" /> },
  { id: 'Flights', label: 'Flights', icon: <Plane className="h-4 w-4" /> },
  { id: 'Hotels', label: 'Hotels', icon: <Hotel className="h-4 w-4" /> },
  { id: 'Budget', label: 'Budget', icon: <DollarSign className="h-4 w-4" /> },
  { id: 'Packing', label: 'Packing List', icon: <Luggage className="h-4 w-4" /> },
  { id: 'AI Assistant', label: 'AI Assistant', icon: <Bot className="h-4 w-4" /> },
];

export const TripDetailsPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DetailTab>('Overview');

  const { data: trip, isLoading, isError } = useQuery<Trip>({
    queryKey: ['trip', tripId],
    queryFn: () => tripService.getTripById(tripId!),
    enabled: !!tripId,
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="py-20 text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-2 border-sky-600 dark:border-sky-400 border-t-transparent rounded-full mx-auto" />
          <p className="text-slate-500 dark:text-slate-400 text-xs">Loading trip details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !trip) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto py-16 text-center">
          <Card className="p-8 border-rose-200 dark:border-rose-500/30">
            <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400">Trip Not Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              The trip you are looking for does not exist or you do not have permission to view it.
            </p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Navigation & Trip Hero Card */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </button>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {trip.title}
                  </h1>
                  <Badge variant="sky">{trip.status}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 text-sky-600 dark:text-sky-400 mr-1" /> {trip.destination}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mr-1" /> {trip.startDate} → {trip.endDate}
                  </span>
                  <span className="flex items-center">
                    <Users className="h-4 w-4 text-amber-600 dark:text-amber-400 mr-1" /> {trip.travelers} Traveler(s)
                  </span>
                  <span className="flex items-center font-medium">
                    <DollarSign className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mr-1" /> {trip.currency} {trip.budget.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher Bar */}
        <div className="flex items-center space-x-1.5 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-sky-600 dark:bg-sky-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Rendering */}
        <div className="min-h-[300px]">
          {activeTab === 'Overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                  Trip Details Overview
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs text-slate-700 dark:text-slate-300">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-semibold block">Destination</span>
                    <strong className="text-slate-900 dark:text-white">{trip.destination}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-semibold block">Origin</span>
                    <strong className="text-slate-900 dark:text-white">{trip.origin || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-semibold block">Start Date</span>
                    <strong className="text-slate-900 dark:text-white">{trip.startDate}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-semibold block">End Date</span>
                    <strong className="text-slate-900 dark:text-white">{trip.endDate}</strong>
                  </div>
                </div>
              </Card>

              <Card className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                  Preferences
                </h3>
                {trip.preferences ? (
                  <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Interests</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {trip.preferences.interests?.map((i) => (
                          <Badge key={i} variant="sky">{i}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Pace</span>
                      <p className="text-slate-900 dark:text-slate-100 font-medium">{trip.preferences.pace || 'Moderate'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Lodging</span>
                      <p className="text-slate-900 dark:text-slate-100 font-medium">{trip.preferences.accommodationPreference || 'Hotel'}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No preferences configured.</p>
                )}
              </Card>
            </div>
          )}

          {activeTab !== 'Overview' && (
            <Card className="p-12 text-center space-y-4 border-dashed border-slate-300 dark:border-slate-800 max-w-xl mx-auto">
              <div className="p-3 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-full w-fit mx-auto">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{activeTab} Module</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  This section is architected and ready for future integrations (Gemini AI, Google Maps, OpenWeather, Amadeus APIs).
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
