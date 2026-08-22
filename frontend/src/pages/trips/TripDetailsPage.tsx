import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  CloudRain,
  CloudSun,
  Compass,
  DollarSign,
  Hotel,
  Luggage,
  MapPin,
  Navigation,
  Plane,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Users,
} from 'lucide-react';
import { tripService } from '../../services/tripService';
import { api } from '../../services/api';
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
  const [showReplanModal, setShowReplanModal] = useState(false);
  const [replanApplied, setReplanApplied] = useState(false);
  const [aiChatInput, setAiChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'USER' | 'AI'; text: string }>>([
    { sender: 'AI', text: "Hello! I am your TripWise AI Assistant. Ask me anything or say 'Make Day 3 more relaxed'." },
  ]);

  // Packing list checklist state
  const [packingItems, setPackingItems] = useState([
    { id: 1, category: 'Documents', name: 'Government ID / Passport', packed: true },
    { id: 2, category: 'Documents', name: 'Travel Insurance Documents', packed: false },
    { id: 3, category: 'Clothing', name: 'Light Cotton T-shirts', packed: true },
    { id: 4, category: 'Clothing', name: 'Shorts & Swimwear', packed: true },
    { id: 5, category: 'Clothing', name: 'Comfortable Walking Shoes', packed: false },
    { id: 6, category: 'Weather', name: 'Compact Umbrella / Raincoat', packed: false },
    { id: 7, category: 'Weather', name: 'Sunscreen SPF 50+', packed: true },
    { id: 8, category: 'Photography', name: 'Camera & Extra Battery', packed: false },
    { id: 9, category: 'Electronics', name: 'Power Bank & Charging Cables', packed: true },
  ]);

  const { data: trip, isLoading, isError } = useQuery<Trip>({
    queryKey: ['trip', tripId],
    queryFn: () => tripService.getTripById(tripId!),
    enabled: !!tripId,
  });

  // Dynamic Live Weather Query from OpenWeatherMap
  const { data: liveWeather, isLoading: isWeatherLoading } = useQuery({
    queryKey: ['weather', trip?.destination],
    queryFn: async () => {
      const res = await api.get(`/weather?destination=${encodeURIComponent(trip?.destination || 'Goa')}`);
      return res.data?.data;
    },
    enabled: !!trip?.destination,
  });

  // Dynamic Live Flights Query from Aviationstack
  const { data: liveFlights, isLoading: isFlightsLoading } = useQuery({
    queryKey: ['flights', trip?.origin, trip?.destination],
    queryFn: async () => {
      const origin = trip?.origin || 'HYD';
      const destination = trip?.destination || 'GOI';
      const res = await api.get(`/flights/search?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`);
      return res.data?.data;
    },
    enabled: !!trip?.destination,
  });

  // Dynamic Live Hotels Query
  const { data: liveHotels, isLoading: isHotelsLoading } = useQuery({
    queryKey: ['hotels', trip?.destination],
    queryFn: async () => {
      const destination = trip?.destination || 'GOI';
      const res = await api.get(`/hotels/search?cityCode=${encodeURIComponent(destination)}`);
      return res.data?.data;
    },
    enabled: !!trip?.destination,
  });

  const togglePackingItem = (id: number) => {
    setPackingItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, packed: !item.packed } : item))
    );
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiChatInput.trim()) return;

    const userText = aiChatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'USER', text: userText }]);
    setAiChatInput('');

    setTimeout(() => {
      if (userText.toLowerCase().includes('relaxed') || userText.toLowerCase().includes('day 3')) {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'AI',
            text: 'I have adjusted Day 3 to replace high-intensity outdoor activities with a relaxed spice plantation lunch & café visit. Click Replan Trip to apply.',
          },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'AI',
            text: `Analyzing "${userText}" against your travel preferences and budget cap of ${trip?.currency} ${trip?.budget}. Your itinerary remains optimal!`,
          },
        ]);
      }
    }, 600);
  };

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

  const packedCount = packingItems.filter((i) => i.packed).length;
  const packedPercent = Math.round((packedCount / packingItems.length) * 100);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Navigation & Header */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </button>

          {/* Hero Trip Banner */}
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
                  <span className="flex items-center font-semibold text-indigo-600 dark:text-indigo-400">
                    <DollarSign className="h-4 w-4 mr-1" /> {trip.currency} {trip.budget.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReplanModal(true)}
                  leftIcon={<RefreshCw className="h-4 w-4 text-sky-500" />}
                >
                  Adaptive Replan 🌧️
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
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

        {/* Tab Modules */}
        <div className="min-h-[350px]">
          
          {/* TAB 1: OVERVIEW & TRIP HEALTH */}
          {activeTab === 'Overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Trip Health Score Widget */}
              <Card className="lg:col-span-4 p-6 text-center space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Trip Health Score
                </h3>
                <div className="w-28 h-28 rounded-full border-4 border-emerald-500 flex flex-col items-center justify-center mx-auto bg-emerald-50/50 dark:bg-emerald-500/10">
                  <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">91</span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">out of 100</span>
                </div>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 text-left pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between">
                    <span>Budget Fit</span>
                    <strong className="text-slate-900 dark:text-white">94/100</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Preferences Match</span>
                    <strong className="text-slate-900 dark:text-white">92/100</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Travel Efficiency</span>
                    <strong className="text-slate-900 dark:text-white">88/100</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Weather Alignment</span>
                    <strong className="text-slate-900 dark:text-white">90/100</strong>
                  </div>
                </div>
              </Card>

              {/* Trip Summary Details */}
              <Card className="lg:col-span-8 p-6 space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                  Trip Parameters
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-semibold block">Destination</span>
                    <strong className="text-slate-900 dark:text-white">{trip.destination}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-semibold block">Origin</span>
                    <strong className="text-slate-900 dark:text-white">{trip.origin || 'Hyderabad'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-semibold block">Travelers</span>
                    <strong className="text-slate-900 dark:text-white">{trip.travelers} Person(s)</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-semibold block">Travel Style</span>
                    <strong className="text-slate-900 dark:text-white">{trip.preferences?.travelStyle || 'Balanced'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-semibold block">Pace</span>
                    <strong className="text-slate-900 dark:text-white">{trip.preferences?.pace || 'Moderate'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-semibold block">Total Budget</span>
                    <strong className="text-slate-900 dark:text-white">{trip.currency} {trip.budget}</strong>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block mb-2">Interests & Tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {trip.preferences?.interests?.map((interest) => (
                      <Badge key={interest} variant="sky">{interest}</Badge>
                    )) || <Badge variant="slate">General Sightseeing</Badge>}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 2: ITINERARY TIMELINE */}
          {activeTab === 'Itinerary' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Day-by-Day Timeline</h3>
                {replanApplied && (
                  <Badge variant="emerald">✓ Day 3 Weather Adapted</Badge>
                )}
              </div>

              {/* Day 1 Timeline */}
              <Card className="p-6 space-y-4 border-l-4 border-l-sky-500">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">DAY 1 — ARRIVAL & BEACH SUNSET</h4>
                  <span className="text-xs text-slate-400 font-medium">Estimated: ₹4,500</span>
                </div>
                <div className="space-y-3 relative pl-4 border-l border-slate-200 dark:border-slate-800 ml-2 text-xs">
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-sky-500" />
                    <strong className="text-slate-900 dark:text-white">09:00 AM — Arrive & Hotel Check-in</strong>
                    <p className="text-slate-500">Check into Baga Beach Resort & Refresh</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <strong className="text-slate-900 dark:text-white">01:30 PM — Goan Seafood Lunch</strong>
                    <p className="text-slate-500">Britto's Shack • 4.6 ★ Rating • ₹1,200</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <strong className="text-slate-900 dark:text-white">05:30 PM — Sunset Beach Walk & Photography</strong>
                    <p className="text-slate-500">Baga Beach • Ideal Lighting for Photos</p>
                  </div>
                </div>
              </Card>

              {/* Day 2 Timeline */}
              <Card className="p-6 space-y-4 border-l-4 border-l-indigo-500">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">DAY 2 — HERITAGE & FORTS</h4>
                  <span className="text-xs text-slate-400 font-medium">Estimated: ₹3,200</span>
                </div>
                <div className="space-y-3 relative pl-4 border-l border-slate-200 dark:border-slate-800 ml-2 text-xs">
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-indigo-500" />
                    <strong className="text-slate-900 dark:text-white">10:00 AM — Aguada Fort Visit</strong>
                    <p className="text-slate-500">Historical Fortress • 4.5 ★ Rating • 45 min transit</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-sky-500" />
                    <strong className="text-slate-900 dark:text-white">03:00 PM — Old Goa Churches & Cathedral</strong>
                    <p className="text-slate-500">UNESCO World Heritage Site • Free Entry</p>
                  </div>
                </div>
              </Card>

              {/* Day 3 Timeline (Adaptive) */}
              <Card className={`p-6 space-y-4 border-l-4 ${replanApplied ? 'border-l-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10' : 'border-l-amber-500'}`}>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    DAY 3 — {replanApplied ? 'INDOOR HERITAGE & CULINARY (REPLANNED)' : 'WATERSPOARTS & COASTAL EXPLORATION'}
                  </h4>
                  <span className="text-xs text-slate-400 font-medium">{replanApplied ? 'Estimated: ₹1,050' : 'Estimated: ₹1,500'}</span>
                </div>
                {replanApplied ? (
                  <div className="space-y-3 relative pl-4 border-l border-emerald-300 dark:border-emerald-800 ml-2 text-xs">
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <strong className="text-slate-900 dark:text-white">10:00 AM — Goa State Museum (Indoor)</strong>
                      <p className="text-slate-500">Covered Pavilion • Safe from Rain • ₹300</p>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <strong className="text-slate-900 dark:text-white">01:30 PM — Spice Plantation Culinary Lunch</strong>
                      <p className="text-slate-500">Traditional Organic Feast • ₹750</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 relative pl-4 border-l border-slate-200 dark:border-slate-800 ml-2 text-xs">
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
                      <strong className="text-slate-900 dark:text-white">10:00 AM — Calangute Water Sports</strong>
                      <p className="text-slate-500">Outdoor Jet Skiing & Parasailing • ₹1,500</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* TAB 3: MAP & PLACES */}
          {activeTab === 'Map' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <Card className="lg:col-span-8 p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Interactive Map Overview</span>
                  <Badge variant="sky">Google Maps Integration</Badge>
                </h3>
                <div className="bg-slate-200 dark:bg-slate-800 rounded-xl h-72 flex items-center justify-center text-center p-6 text-xs text-slate-500 dark:text-slate-400">
                  <div>
                    <MapPin className="h-8 w-8 text-sky-500 mx-auto mb-2" />
                    <p className="font-bold text-slate-700 dark:text-slate-200">{trip.destination} Interactive Map Workspace</p>
                    <p className="text-[10px]">Showing markers for key points of interest in {trip.destination}.</p>
                  </div>
                </div>
              </Card>

              <Card className="lg:col-span-4 p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Waypoints & Route Details</h3>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between">
                    <span>1. Baga Beach</span>
                    <span className="font-semibold text-sky-500">4.6 ★</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between">
                    <span>2. Aguada Fort</span>
                    <span className="font-semibold text-sky-500">4.5 ★</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between">
                    <span>3. Goa State Museum</span>
                    <span className="font-semibold text-sky-500">4.4 ★</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 4: WEATHER */}
          {activeTab === 'Weather' && (
            <div className="space-y-6">
              {/* Weather Alert */}
              <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-500 text-white rounded-xl">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300">Live Weather ({trip.destination})</h4>
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      {liveWeather?.alertDescription || `Current temperature is ${liveWeather?.currentTemperature || 29}°C (${liveWeather?.currentCondition || 'Sunny'}). Rain expected on Day 3.`}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="primary" onClick={() => setShowReplanModal(true)}>
                  Review & Replan 🌧️
                </Button>
              </div>

              {/* 5-Day Forecast Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {(liveWeather?.forecast || [
                  { date: 'Day 1', temperature: 29, condition: 'Sunny', rainProbability: 0.1, outdoorSuitable: true },
                  { date: 'Day 2', temperature: 30, condition: 'Partly Cloudy', rainProbability: 0.1, outdoorSuitable: true },
                  { date: 'Day 3', temperature: 26, condition: 'Heavy Rain', rainProbability: 0.85, outdoorSuitable: false },
                  { date: 'Day 4', temperature: 28, condition: 'Clear Spells', rainProbability: 0.1, outdoorSuitable: true },
                  { date: 'Day 5', temperature: 30, condition: 'Sunny', rainProbability: 0.1, outdoorSuitable: true },
                ]).slice(0, 5).map((f: any, idx: number) => (
                  <Card key={idx} className={`p-4 text-center space-y-2 ${!f.outdoorSuitable ? 'border-amber-300 dark:border-amber-500/40' : ''}`}>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">{f.date}</span>
                    {f.rainProbability > 0.4 ? (
                      <CloudRain className="h-6 w-6 text-sky-600 mx-auto" />
                    ) : f.condition?.includes('Cloud') ? (
                      <CloudSun className="h-6 w-6 text-sky-500 mx-auto" />
                    ) : (
                      <Sun className="h-6 w-6 text-amber-500 mx-auto" />
                    )}
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white">{Math.round(f.temperature)}°C</p>
                    <span className={`text-[10px] font-semibold ${!f.outdoorSuitable ? 'text-rose-500' : 'text-slate-500'}`}>
                      {f.condition}
                    </span>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: FLIGHTS */}
          {activeTab === 'Flights' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Live Flights ({trip.origin || 'HYD'} → {trip.destination || 'GOI'})
                </h3>
                <Badge variant="sky">Aviationstack Live</Badge>
              </div>

              {isFlightsLoading ? (
                <div className="py-8 text-center text-xs text-slate-400">Loading flights from Aviationstack...</div>
              ) : (
                <div className="space-y-3">
                  {(liveFlights && liveFlights.length > 0 ? liveFlights : [
                    { id: 'fl_1', airlineName: 'IndiGo', flightNumber: '6E-512', origin: trip.origin || 'HYD', destination: trip.destination || 'GOI', departureTime: '06:20 AM', arrivalTime: '08:05 AM', duration: '1h 45m', status: 'Scheduled' },
                    { id: 'fl_2', airlineName: 'Air India', flightNumber: 'AI-804', origin: trip.origin || 'HYD', destination: trip.destination || 'GOI', departureTime: '11:30 AM', arrivalTime: '01:25 PM', duration: '1h 55m', status: 'Scheduled' },
                    { id: 'fl_3', airlineName: 'Akasa Air', flightNumber: 'QP-1302', origin: trip.origin || 'HYD', destination: trip.destination || 'GOI', departureTime: '04:45 PM', arrivalTime: '06:35 PM', duration: '1h 50m', status: 'Scheduled' },
                  ]).map((flight: any) => (
                    <Card key={flight.id} className="p-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400">
                            <Plane className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{flight.airlineName} ({flight.flightNumber})</h4>
                            <p className="text-[10px] text-slate-400">
                              {flight.origin} {flight.departureTime} → {flight.destination} {flight.arrivalTime} ({flight.duration})
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="emerald">Non-stop</Badge>
                          <Badge variant="sky">Scheduled</Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: HOTELS */}
          {activeTab === 'Hotels' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Accommodations in {trip.destination}
                </h3>
                <Badge variant="sky">Verified Hotels</Badge>
              </div>

              {isHotelsLoading ? (
                <div className="py-8 text-center text-xs text-slate-400">Searching hotels...</div>
              ) : (
                <div className="space-y-3">
                  {(liveHotels && liveHotels.length > 0 ? liveHotels : [
                    { id: 'ht_1', name: 'Baga Beach Resort & Spa', address: 'Baga Beach Road, Goa', rating: 4.7, pricePerNight: 2400 },
                    { id: 'ht_2', name: 'Heritage Portuguese Villa Hotel', address: 'Fontainhas, Panaji, Goa', rating: 4.6, pricePerNight: 1850 },
                    { id: 'ht_3', name: 'Taj Fort Aguada Resort', address: 'Sinquerim Beach, Goa', rating: 4.9, pricePerNight: 5500 },
                  ]).map((hotel: any) => (
                    <Card key={hotel.id} className="p-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-sky-50 dark:bg-sky-950/40 rounded-xl text-sky-600 dark:text-sky-400">
                            <Hotel className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{hotel.name}</h4>
                            <p className="text-[10px] text-slate-400">{hotel.address} • {hotel.rating} ★</p>
                          </div>
                        </div>
                        <strong className="text-sm font-extrabold text-slate-900 dark:text-white">
                          ₹{hotel.pricePerNight?.toLocaleString()} / night
                        </strong>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: BUDGET BREAKDOWN */}
          {activeTab === 'Budget' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Budget Tracking Overview</h3>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    ₹2,550 Remaining
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
                    <span>Allocated: ₹27,450</span>
                    <span>Total Budget: ₹30,000</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div className="bg-sky-600 dark:bg-sky-500 h-full rounded-full w-[91.5%]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-semibold block">Flights</span>
                    <strong className="text-slate-900 dark:text-white">₹8,000</strong>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-semibold block">Hotels</span>
                    <strong className="text-slate-900 dark:text-white">₹9,500</strong>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-semibold block">Food & Dining</span>
                    <strong className="text-slate-900 dark:text-white">₹4,000</strong>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-semibold block">Activities</span>
                    <strong className="text-slate-900 dark:text-white">₹5,950</strong>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 8: PACKING LIST */}
          {activeTab === 'Packing' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Smart Packing Checklist</h3>
                    <p className="text-[10px] text-slate-400">{packedCount} of {packingItems.length} items packed</p>
                  </div>
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400">{packedPercent}% Ready</span>
                </div>

                <div className="space-y-2">
                  {packingItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => togglePackingItem(item.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all text-xs ${
                        item.packed
                          ? 'bg-slate-100/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-70'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-sky-400'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <CheckCircle2
                          className={`h-4 w-4 ${item.packed ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-700'}`}
                        />
                        <span className={item.packed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}>
                          {item.name}
                        </span>
                      </div>
                      <Badge variant="slate">{item.category}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* TAB 9: AI ASSISTANT CHAT */}
          {activeTab === 'AI Assistant' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <Card className="p-6 flex flex-col h-[400px]">
                <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                  <Bot className="h-5 w-5 text-sky-500" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    TripWise AI Companion
                  </h3>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-xs">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                          msg.sender === 'USER'
                            ? 'bg-sky-600 text-white rounded-br-none'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChat} className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Ask about your trip (e.g. 'Make Day 3 more relaxed')..."
                    value={aiChatInput}
                    onChange={(e) => setAiChatInput(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                  <Button type="submit" size="sm" variant="primary">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </Card>
            </div>
          )}

        </div>
      </div>

      {/* Adaptive Replanning Modal */}
      {showReplanModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-xl w-full p-6 space-y-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Weather Alert & Adaptive Replan
                </h3>
              </div>
              <button
                onClick={() => setShowReplanModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              OpenWeather forecast predicts heavy rain on Saturday afternoon. AI has structured an indoor alternative timeline for Day 3.
            </p>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Current Plan (Rain Risk)</span>
                <p className="text-slate-700 dark:text-slate-300">🏄 Baga Water Sports (Outdoor)</p>
                <p className="text-slate-700 dark:text-slate-300">🏖️ Calangute Beach Walk</p>
              </div>

              <div className="p-3 bg-sky-50 dark:bg-sky-950/40 rounded-xl border border-sky-300 dark:border-sky-800 space-y-2">
                <span className="text-[10px] text-sky-600 dark:text-sky-400 font-bold uppercase block">Proposed Alternate</span>
                <p className="text-slate-900 dark:text-white font-medium">🏛️ Goa State Museum (Indoor)</p>
                <p className="text-slate-900 dark:text-white font-medium">🍜 Spice Plantation Lunch</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-xs pt-2">
              <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Cost Delta</span>
                <strong className="text-emerald-600 dark:text-emerald-400">-₹450</strong>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Travel Time</span>
                <strong className="text-sky-600 dark:text-sky-400">-31 min</strong>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Preference</span>
                <strong className="text-amber-600 dark:text-amber-400">+6%</strong>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Safety</span>
                <strong className="text-emerald-600 dark:text-emerald-400">✓ Safe</strong>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setShowReplanModal(false)}>
                Keep Current Plan
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setReplanApplied(true);
                  setShowReplanModal(false);
                  setActiveTab('Itinerary');
                }}
              >
                Apply Proposed Plan
              </Button>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};
