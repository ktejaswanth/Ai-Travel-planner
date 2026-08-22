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
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: trip, isLoading, isError, refetch: refetchTrip } = useQuery<Trip>({
    queryKey: ['trip', tripId],
    queryFn: () => tripService.getTripById(tripId!),
    enabled: !!tripId,
  });

  const { data: itineraryData, refetch: refetchItinerary } = useQuery({
    queryKey: ['itinerary', tripId],
    queryFn: () => tripService.getItinerary(tripId!),
    enabled: !!tripId,
    retry: false,
  });

  const handleGenerateItinerary = async () => {
    if (!tripId) return;
    try {
      setIsGenerating(true);
      await tripService.generateItinerary(tripId);
      await Promise.all([refetchTrip(), refetchItinerary()]);
      setActiveTab('Itinerary');
    } catch (err) {
      console.error('Failed to generate AI itinerary:', err);
    } finally {
      setIsGenerating(false);
    }
  };

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

  const budgetPlan = itineraryData?.budgetPlan;
  const days = itineraryData?.days || [];

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

            <Button
              onClick={handleGenerateItinerary}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-sky-500/20"
            >
              <Sparkles className="h-4 w-4" />
              {isGenerating ? 'Analyzing Prices & Planning...' : days.length > 0 ? 'Replan Itinerary' : 'Generate AI Itinerary'}
            </Button>
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

                {budgetPlan && (
                  <div className="mt-6 pt-4 border-t border-slate-800">
                    <h4 className="text-sm font-semibold text-sky-400 mb-2">Live Scraped Cost Allocation</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block">Flight / Transit</span>
                        <span className="font-bold text-slate-200">{trip.currency} {budgetPlan.flightAllocation?.toLocaleString()}</span>
                      </div>
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block">Hotel / Stay</span>
                        <span className="font-bold text-slate-200">{trip.currency} {budgetPlan.hotelAllocation?.toLocaleString()}</span>
                      </div>
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block">Food & Dining</span>
                        <span className="font-bold text-slate-200">{trip.currency} {budgetPlan.foodAllocation?.toLocaleString()}</span>
                      </div>
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block">Activities & Entry</span>
                        <span className="font-bold text-slate-200">{trip.currency} {budgetPlan.activitiesAllocation?.toLocaleString()}</span>
                      </div>
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block">Local Transit</span>
                        <span className="font-bold text-slate-200">{trip.currency} {budgetPlan.transportAllocation?.toLocaleString()}</span>
                      </div>
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block">Emergency Buffer</span>
                        <span className="font-bold text-emerald-400">{trip.currency} {budgetPlan.emergencyBuffer?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
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

          {activeTab === 'Itinerary' && (
            <div className="space-y-6">
              {days.length === 0 ? (
                <Card className="p-12 text-center space-y-4 border-dashed border-slate-800 max-w-2xl mx-auto">
                  <div className="p-4 bg-sky-500/10 text-sky-400 rounded-full w-fit mx-auto">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">No Itinerary Generated Yet</h3>
                    <p className="text-sm text-slate-400 mt-2">
                      Click the "Generate AI Itinerary" button to scrape live market prices and build your custom plan.
                    </p>
                  </div>
                  <Button onClick={handleGenerateItinerary} disabled={isGenerating}>
                    Generate Plan Now
                  </Button>
                </Card>
              ) : (
                <div className="space-y-6">
                  {days.map((day) => (
                    <Card key={day.dayNumber} className="space-y-4 p-6">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div>
                          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Day {day.dayNumber}</span>
                          <h3 className="text-lg font-bold text-white">{day.title}</h3>
                        </div>
                        <span className="text-xs text-slate-400 font-medium">{day.date}</span>
                      </div>

                      <div className="space-y-3">
                        {day.activities?.map((activity, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/80 gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-sky-400">{activity.startTime} - {activity.endTime}</span>
                                <Badge variant="indigo">{activity.category}</Badge>
                              </div>
                              <h4 className="text-sm font-bold text-slate-100">{activity.title}</h4>
                              <p className="text-xs text-slate-400">{activity.description}</p>
                            </div>
                            <div className="text-right whitespace-nowrap">
                              <span className="text-xs text-slate-500 block">Est. Cost</span>
                              <span className="text-sm font-bold text-emerald-400">
                                {activity.currency} {activity.estimatedCost?.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Budget' && (
            <Card className="space-y-6 p-6">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Live Budget & Market Allocations</h3>
              {budgetPlan ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-500 block uppercase">Total Trip Budget</span>
                      <span className="text-xl font-black text-white">{trip.currency} {budgetPlan.totalBudget?.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-500 block uppercase">Estimated Total Cost</span>
                      <span className="text-xl font-black text-sky-400">{trip.currency} {budgetPlan.totalEstimated?.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-500 block uppercase">Remaining Buffer</span>
                      <span className="text-xl font-black text-emerald-400">{trip.currency} {budgetPlan.remaining?.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Budget Utilization</span>
                      <span>{budgetPlan.utilizationPercentage}% Allocated</span>
                    </div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, budgetPlan.utilizationPercentage || 0)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-400">Generate an AI itinerary to compute real-time scraped budget allocations.</p>
              )}
            </Card>
          )}

          {activeTab !== 'Overview' && activeTab !== 'Itinerary' && activeTab !== 'Budget' && (
            <Card className="p-12 text-center space-y-4 border-dashed border-slate-800 max-w-2xl mx-auto">
              <div className="p-4 bg-sky-500/10 text-sky-400 rounded-full w-fit mx-auto">
                <Sparkles className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{activeTab} Module</h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  This section is architected and ready for future integrations (Google Maps, OpenWeather, Amadeus APIs).
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
