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
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
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
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-16 text-center space-y-4">
          <div className="animate-spin h-10 w-10 border-2 border-sky-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-slate-400 text-sm">Loading trip details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !trip) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <Navbar />
        <main className="flex-1 max-w-md w-full mx-auto px-4 py-20 text-center space-y-4">
          <Card className="p-8 border-rose-500/30">
            <h3 className="text-xl font-bold text-rose-400">Trip Not Found</h3>
            <p className="text-xs text-slate-400 mt-2">
              The trip you are looking for does not exist or you do not have permission to view it.
            </p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Navigation & Header */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-sky-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-extrabold text-white tracking-tight">{trip.title}</h1>
                <Badge variant="sky">{trip.status}</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 text-sky-400 mr-1" /> {trip.destination}
                </span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 text-emerald-400 mr-1" /> {trip.startDate} → {trip.endDate}
                </span>
                <span className="flex items-center">
                  <Users className="h-4 w-4 text-amber-400 mr-1" /> {trip.travelers} Traveler(s)
                </span>
                <span className="flex items-center">
                  <DollarSign className="h-4 w-4 text-indigo-400 mr-1" /> {trip.currency} {trip.budget.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <div className="min-h-[300px]">
          {activeTab === 'Overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 space-y-4">
                <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Trip Overview</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
                  <div>
                    <span className="text-xs uppercase text-slate-500 font-semibold block">Destination</span>
                    <strong className="text-slate-100">{trip.destination}</strong>
                  </div>
                  <div>
                    <span className="text-xs uppercase text-slate-500 font-semibold block">Origin</span>
                    <strong className="text-slate-100">{trip.origin || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-xs uppercase text-slate-500 font-semibold block">Start Date</span>
                    <strong className="text-slate-100">{trip.startDate}</strong>
                  </div>
                  <div>
                    <span className="text-xs uppercase text-slate-500 font-semibold block">End Date</span>
                    <strong className="text-slate-100">{trip.endDate}</strong>
                  </div>
                </div>
              </Card>

              <Card className="space-y-4">
                <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Travel Preferences</h3>
                {trip.preferences ? (
                  <div className="space-y-3 text-xs text-slate-300">
                    <div>
                      <span className="text-slate-500 uppercase block font-semibold">Interests</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {trip.preferences.interests?.map((i) => (
                          <Badge key={i} variant="sky">{i}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase block font-semibold">Pace</span>
                      <p className="text-slate-200 font-medium">{trip.preferences.pace || 'Moderate'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase block font-semibold">Accommodation</span>
                      <p className="text-slate-200 font-medium">{trip.preferences.accommodationPreference || 'Hotel'}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No preferences configured.</p>
                )}
              </Card>
            </div>
          )}

          {activeTab !== 'Overview' && (
            <Card className="p-12 text-center space-y-4 border-dashed border-slate-800 max-w-2xl mx-auto">
              <div className="p-4 bg-sky-500/10 text-sky-400 rounded-full w-fit mx-auto">
                <Sparkles className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{activeTab} Module</h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  This section is architected and ready for future integrations (Gemini AI, Google Maps, OpenWeather, Amadeus APIs).
                </p>
              </div>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
