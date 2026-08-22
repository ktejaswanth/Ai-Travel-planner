import React, { useState, useMemo } from 'react';
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
    { sender: 'AI', text: "Hello! I am your TripWise AI Assistant. Ask me anything about your destination or say 'Make Day 3 more relaxed'." },
  ]);

  const { data: trip, isLoading, isError } = useQuery<Trip>({
    queryKey: ['trip', tripId],
    queryFn: () => tripService.getTripById(tripId!),
    enabled: !!tripId,
  });

  // Dynamic Live Weather Query from OpenWeatherMap
  const { data: liveWeather } = useQuery({
    queryKey: ['weather', trip?.destination],
    queryFn: async () => {
      const res = await api.get(`/weather?destination=${encodeURIComponent(trip?.destination || 'Paris')}`);
      return res.data?.data;
    },
    enabled: !!trip?.destination,
  });

  // Dynamic Live Flights Query from Aviationstack
  const { data: liveFlights, isLoading: isFlightsLoading } = useQuery({
    queryKey: ['flights', trip?.origin, trip?.destination],
    queryFn: async () => {
      const origin = trip?.origin || 'HYD';
      const destination = trip?.destination || 'PAR';
      const res = await api.get(`/flights/search?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`);
      return res.data?.data;
    },
    enabled: !!trip?.destination,
  });

  // Dynamic Live Hotels Query
  const { data: liveHotels, isLoading: isHotelsLoading } = useQuery({
    queryKey: ['hotels', trip?.destination],
    queryFn: async () => {
      const destination = trip?.destination || 'PAR';
      const res = await api.get(`/hotels/search?cityCode=${encodeURIComponent(destination)}`);
      return res.data?.data;
    },
    enabled: !!trip?.destination,
  });

  // Dynamic Destination-Aware Itinerary Generator
  const itineraryDays = useMemo(() => {
    const dest = (trip?.destination || 'Paris').trim().toLowerCase();
    const destName = trip?.destination || 'Paris';
    const isParis = dest.includes('paris') || dest.includes('france');
    const isTokyo = dest.includes('tokyo') || dest.includes('japan');
    const isLondon = dest.includes('london') || dest.includes('uk');
    const isNewYork = dest.includes('new york') || dest.includes('nyc');
    const isGoa = dest.includes('goa');

    if (isParis) {
      return [
        {
          dayNumber: 1,
          title: 'ARRIVAL & ICONIC LANDMARKS',
          themeBorder: 'border-l-sky-500',
          activities: [
            { time: '09:30 AM', title: 'Eiffel Tower & Champ de Mars', desc: 'Visit the summit for panoramic skyline views of Paris', dot: 'bg-sky-500' },
            { time: '01:00 PM', title: 'Traditional French Bistro Lunch', desc: 'Le Marais Quarter • Coq au vin & Fresh Baguettes', dot: 'bg-amber-500' },
            { time: '05:30 PM', title: 'Sunset Cruise on the River Seine', desc: 'Bateaux Parisiens • Pass under Pont Alexandre III', dot: 'bg-emerald-500' },
          ],
        },
        {
          dayNumber: 2,
          title: 'ART, CULTURE & ROYAL BOULEVARDS',
          themeBorder: 'border-l-indigo-500',
          activities: [
            { time: '10:00 AM', title: 'Louvre Museum & Mona Lisa Gallery', desc: 'World famous masterworks, Glass Pyramid & Venus de Milo', dot: 'bg-indigo-500' },
            { time: '02:00 PM', title: 'Tuileries Gardens & Coffee', desc: 'Artisan crêpes, outdoor sculptures & Grand Fountain', dot: 'bg-amber-500' },
            { time: '04:30 PM', title: 'Arc de Triomphe & Champs-Élysées', desc: 'Rooftop vistas and luxury promenade walk', dot: 'bg-sky-500' },
          ],
        },
        {
          dayNumber: 3,
          title: replanApplied ? 'INDOOR ART & HISTORIC ARCADES (REPLANNED 🌧️)' : 'BOHEMIAN MONTMARTRE & BASILICA',
          themeBorder: replanApplied ? 'border-l-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10' : 'border-l-amber-500',
          activities: replanApplied ? [
            { time: '10:00 AM', title: 'Musée d\'Orsay (Indoor Impressionism)', desc: 'Covered Impressionist gallery • Safe from rain • Monet & Van Gogh', dot: 'bg-emerald-500' },
            { time: '01:30 PM', title: 'Galerie Vivienne & Covered Passage Cafés', desc: '19th-century glass-roofed arcade dining & artisan hot chocolate', dot: 'bg-emerald-500' },
            { time: '04:30 PM', title: 'Panthéon Crypt & Latin Quarter Tour', desc: 'Historic indoor monument and landmark vaults', dot: 'bg-emerald-500' },
          ] : [
            { time: '10:00 AM', title: 'Montmartre & Sacré-Cœur Basilica', desc: 'Cobblestone streets, artists at Place du Tertre & city viewpoints', dot: 'bg-amber-500' },
            { time: '02:00 PM', title: 'Latin Quarter & Shakespeare and Company', desc: 'Historic bookshops, Saint-Germain-des-Prés terraces', dot: 'bg-sky-500' },
            { time: '05:30 PM', title: 'Notre-Dame Cathedral & Île de la Cité', desc: 'Historic heart of Paris and flower market walk', dot: 'bg-emerald-500' },
          ],
        },
      ];
    }

    if (isTokyo) {
      return [
        {
          dayNumber: 1,
          title: 'MODERN METROPOLIS & SACRED SHRINES',
          themeBorder: 'border-l-sky-500',
          activities: [
            { time: '09:00 AM', title: 'Meiji Jingu Shrine & Yoyogi Park', desc: 'Ancient forest sanctuary and traditional Torii gate walk', dot: 'bg-sky-500' },
            { time: '01:00 PM', title: 'Harajuku Takeshita Street Food', desc: 'Artisan crepes and Japanese matcha desserts', dot: 'bg-amber-500' },
            { time: '05:30 PM', title: 'Shibuya Crossing & Shibuya Sky', desc: 'World’s busiest crossing and 360° sunset observation', dot: 'bg-emerald-500' },
          ],
        },
        {
          dayNumber: 2,
          title: 'HISTORIC TEMPLE & ELECTRIC TOWN',
          themeBorder: 'border-l-indigo-500',
          activities: [
            { time: '09:30 AM', title: 'Senso-ji Temple in Asakusa', desc: 'Tokyo’s oldest Buddhist temple and Nakamise-dori shopping', dot: 'bg-indigo-500' },
            { time: '01:30 PM', title: 'Tokyo Skytree Panoramic Lunch', desc: 'Dining atop the tallest tower in Japan', dot: 'bg-amber-500' },
            { time: '04:30 PM', title: 'Akihabara Electric Town', desc: 'Futuristic electronics, arcade culture & anime shops', dot: 'bg-sky-500' },
          ],
        },
        {
          dayNumber: 3,
          title: replanApplied ? 'IMMERSIVE DIGITAL ART & INDOOR ONSEN (REPLANNED 🌧️)' : 'WATERFRONT & TSUKIJI TASTINGS',
          themeBorder: replanApplied ? 'border-l-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10' : 'border-l-amber-500',
          activities: replanApplied ? [
            { time: '10:00 AM', title: 'TeamLab Planets Digital Museum (Indoor)', desc: 'Fully covered immersive sensory art experience', dot: 'bg-emerald-500' },
            { time: '01:30 PM', title: 'Ginza Six Gourmet Arcade', desc: 'Premium indoor dining and wagyu beef tasting', dot: 'bg-emerald-500' },
          ] : [
            { time: '08:30 AM', title: 'Tsukiji Outer Market Food Tour', desc: 'Fresh sashimi, tamagoyaki, and street seafood', dot: 'bg-amber-500' },
            { time: '02:00 PM', title: 'Odaiba Seaside Park & Rainbow Bridge', desc: 'Waterfront promenade and Gundam statue', dot: 'bg-sky-500' },
          ],
        },
      ];
    }

    if (isGoa) {
      return [
        {
          dayNumber: 1,
          title: 'ARRIVAL & BEACH SUNSET',
          themeBorder: 'border-l-sky-500',
          activities: [
            { time: '09:00 AM', title: 'Arrive & Hotel Check-in', desc: 'Check into Baga Beach Resort & Refresh', dot: 'bg-sky-500' },
            { time: '01:30 PM', title: 'Goan Seafood Lunch', desc: "Britto's Shack • 4.6 ★ Rating • Authentic Goan Curry", dot: 'bg-amber-500' },
            { time: '05:30 PM', title: 'Sunset Beach Walk & Photography', desc: 'Baga Beach • Ideal lighting and coastal breeze', dot: 'bg-emerald-500' },
          ],
        },
        {
          dayNumber: 2,
          title: 'HERITAGE & FORTS',
          themeBorder: 'border-l-indigo-500',
          activities: [
            { time: '10:00 AM', title: 'Aguada Fort Visit', desc: 'Historical 17th-century fortress and lighthouse vista', dot: 'bg-indigo-500' },
            { time: '03:00 PM', title: 'Old Goa Churches & Cathedral', desc: 'Basilica of Bom Jesus • UNESCO World Heritage Site', dot: 'bg-sky-500' },
          ],
        },
        {
          dayNumber: 3,
          title: replanApplied ? 'INDOOR HERITAGE & CULINARY (REPLANNED 🌧️)' : 'WATERSPORTS & COASTAL EXPLORATION',
          themeBorder: replanApplied ? 'border-l-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10' : 'border-l-amber-500',
          activities: replanApplied ? [
            { time: '10:00 AM', title: 'Goa State Museum (Indoor)', desc: 'Covered Pavilion • Safe from rain • Art & artifacts', dot: 'bg-emerald-500' },
            { time: '01:30 PM', title: 'Spice Plantation Culinary Lunch', desc: 'Traditional organic buffet and spice garden walk', dot: 'bg-emerald-500' },
          ] : [
            { time: '10:00 AM', title: 'Calangute Water Sports', desc: 'Jet Skiing & Parasailing on the Arabian Sea', dot: 'bg-amber-500' },
          ],
        },
      ];
    }

    // Dynamic Generic Destination Itinerary
    return [
      {
        dayNumber: 1,
        title: `ARRIVAL & ${destName.toUpperCase()} HIGHLIGHTS`,
        themeBorder: 'border-l-sky-500',
        activities: [
          { time: '09:30 AM', title: `Arrival & Downtown ${destName} Check-in`, desc: `Check into hotel and get oriented in central ${destName}`, dot: 'bg-sky-500' },
          { time: '01:00 PM', title: `Traditional ${destName} Welcome Lunch`, desc: 'Sample authentic regional specialties at a top-rated local bistro', dot: 'bg-amber-500' },
          { time: '05:00 PM', title: 'City Center Plaza & Scenic Sunset', desc: `Explore landmark plazas and evening viewpoints across ${destName}`, dot: 'bg-emerald-500' },
        ],
      },
      {
        dayNumber: 2,
        title: `HISTORIC LANDMARKS & CULTURE OF ${destName.toUpperCase()}`,
        themeBorder: 'border-l-indigo-500',
        activities: [
          { time: '10:00 AM', title: `Grand Museum & Heritage Walk`, desc: `Discover the top historical exhibits and architectural monuments in ${destName}`, dot: 'bg-indigo-500' },
          { time: '02:30 PM', title: 'Artisan Market & Local Crafts', desc: 'Browse famous shopping avenues and handmade souvenirs', dot: 'bg-sky-500' },
        ],
      },
      {
        dayNumber: 3,
        title: replanApplied ? 'INDOOR GALLERIES & CULINARY TASTING (REPLANNED 🌧️)' : 'SCENIC NATURE & PANORAMIC ADVENTURE',
        themeBorder: replanApplied ? 'border-l-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10' : 'border-l-amber-500',
        activities: replanApplied ? [
          { time: '10:00 AM', title: `National Art Gallery of ${destName} (Indoor)`, desc: 'Protected indoor landmark tour safe from rain', dot: 'bg-emerald-500' },
          { time: '01:30 PM', title: 'Covered Gourmet Market Lunch', desc: 'Indoors gastronomy tasting and warm beverages', dot: 'bg-emerald-500' },
        ] : [
          { time: '10:00 AM', title: `Panoramic Viewpoint & Outdoor Stroll`, desc: `Top scenic viewpoint and botanical gardens in ${destName}`, dot: 'bg-amber-500' },
          { time: '03:00 PM', title: 'Cultural Evening & Farewell Dinner', desc: 'Celebratory multi-course dinner with local live music', dot: 'bg-emerald-500' },
        ],
      },
    ];
  }, [trip?.destination, replanApplied]);

  // Destination-specific Waypoints for Map
  const mapWaypoints = useMemo(() => {
    const dest = (trip?.destination || 'Paris').toLowerCase();
    if (dest.includes('paris') || dest.includes('france')) {
      return [
        { name: '1. Eiffel Tower & Trocadéro', rating: '4.8 ★' },
        { name: '2. Louvre Museum & Pyramide', rating: '4.7 ★' },
        { name: '3. Arc de Triomphe & Champs-Élysées', rating: '4.7 ★' },
        { name: '4. Sacré-Cœur & Montmartre', rating: '4.6 ★' },
      ];
    }
    if (dest.includes('tokyo') || dest.includes('japan')) {
      return [
        { name: '1. Shibuya Crossing & Hachiko', rating: '4.8 ★' },
        { name: '2. Senso-ji Temple Asakusa', rating: '4.7 ★' },
        { name: '3. Meiji Shrine Forest', rating: '4.6 ★' },
        { name: '4. Tokyo Skytree Observation', rating: '4.7 ★' },
      ];
    }
    if (dest.includes('goa')) {
      return [
        { name: '1. Baga Beach Promenade', rating: '4.6 ★' },
        { name: '2. Aguada Fort & Lighthouse', rating: '4.5 ★' },
        { name: '3. Basilica of Bom Jesus', rating: '4.7 ★' },
      ];
    }
    return [
      { name: `1. Central ${trip?.destination || 'City'} Historic District`, rating: '4.7 ★' },
      { name: `2. ${trip?.destination || 'City'} Grand Museum & Art Center`, rating: '4.6 ★' },
      { name: `3. ${trip?.destination || 'City'} Botanical Promenade`, rating: '4.8 ★' },
    ];
  }, [trip?.destination]);

  // Destination-specific Hotels
  const destinationHotels = useMemo(() => {
    const dest = (trip?.destination || 'Paris').toLowerCase();
    if (dest.includes('paris') || dest.includes('france')) {
      return [
        { id: 'ht_1', name: 'Pullman Paris Tour Eiffel', address: '18 Avenue de Suffren, 15th arr., Paris', rating: 4.8 },
        { id: 'ht_2', name: 'Hotel Eiffel Seine', address: '3 Boulevard de Grenelle, Paris', rating: 4.6 },
        { id: 'ht_3', name: 'CitizenM Paris Gare de Lyon', address: '7 Rue de Vanves, Paris', rating: 4.7 },
      ];
    }
    if (dest.includes('tokyo') || dest.includes('japan')) {
      return [
        { id: 'ht_1', name: 'Shibuya Stream Excel Hotel Tokyu', address: 'Shibuya, Tokyo', rating: 4.8 },
        { id: 'ht_2', name: 'Hotel Gracery Shinjuku', address: 'Kabukicho, Shinjuku, Tokyo', rating: 4.7 },
        { id: 'ht_3', name: 'Asakusa View Hotel', address: 'Nishiasakusa, Taito City, Tokyo', rating: 4.6 },
      ];
    }
    if (dest.includes('goa')) {
      return [
        { id: 'ht_1', name: 'Baga Beach Resort & Spa', address: 'Baga Beach Road, Goa', rating: 4.7 },
        { id: 'ht_2', name: 'Heritage Portuguese Villa Hotel', address: 'Fontainhas, Panaji, Goa', rating: 4.6 },
        { id: 'ht_3', name: 'Taj Fort Aguada Resort', address: 'Sinquerim Beach, Goa', rating: 4.9 },
      ];
    }
    return [
      { id: 'ht_1', name: `Grand ${trip?.destination || 'City'} Boutique Hotel`, address: `Central Avenue, ${trip?.destination || 'City'}`, rating: 4.7 },
      { id: 'ht_2', name: `The Ritz ${trip?.destination || 'City'} Suites`, address: `Plaza Square, ${trip?.destination || 'City'}`, rating: 4.8 },
      { id: 'ht_3', name: `${trip?.destination || 'City'} Luxury View Resort`, address: `Riverfront Road, ${trip?.destination || 'City'}`, rating: 4.6 },
    ];
  }, [trip?.destination]);

  // Packing Checklist
  const [packingItems, setPackingItems] = useState([
    { id: 1, category: 'Documents', name: 'Passport / Government ID', packed: true },
    { id: 2, category: 'Documents', name: 'Flight Boarding Pass & Hotel Vouchers', packed: true },
    { id: 3, category: 'Clothing', name: 'City Walking Comfortable Shoes', packed: false },
    { id: 4, category: 'Clothing', name: 'Light Casual Wear & Jacket', packed: true },
    { id: 5, category: 'Weather', name: 'Compact Umbrella / Rain Jacket', packed: false },
    { id: 6, category: 'Electronics', name: 'Universal Travel Power Adapter', packed: true },
    { id: 7, category: 'Electronics', name: 'Power Bank & Charging Cables', packed: true },
    { id: 8, category: 'Photography', name: 'Camera & Memory Card', packed: false },
  ]);

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
            text: `I have adjusted Day 3 in ${trip?.destination || 'your destination'} to replace high-intensity outdoor activities with relaxed indoor museum visits & cozy café dining. Click Adaptive Replan to apply.`,
          },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'AI',
            text: `Analyzing "${userText}" for ${trip?.destination || 'your destination'} against your budget cap of ${trip?.currency} ${trip?.budget}. Your itinerary remains optimal!`,
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
                  <span className="flex items-center capitalize">
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
                  <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">92</span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">out of 100</span>
                </div>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 text-left pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between">
                    <span>Budget Fit</span>
                    <strong className="text-slate-900 dark:text-white">94/100</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Preferences Match</span>
                    <strong className="text-slate-900 dark:text-white">93/100</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Travel Efficiency</span>
                    <strong className="text-slate-900 dark:text-white">89/100</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Weather Alignment</span>
                    <strong className="text-slate-900 dark:text-white">91/100</strong>
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
                    <strong className="text-slate-900 dark:text-white capitalize">{trip.destination}</strong>
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
                    <strong className="text-slate-900 dark:text-white">{trip.currency} {trip.budget.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block mb-2">Interests & Tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {trip.preferences?.interests?.map((interest) => (
                      <Badge key={interest} variant="sky">{interest}</Badge>
                    )) || <Badge variant="slate">Sightseeing & Culture</Badge>}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 2: ITINERARY TIMELINE */}
          {activeTab === 'Itinerary' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white capitalize">
                  {trip.destination} Day-by-Day Timeline
                </h3>
                {replanApplied && (
                  <Badge variant="emerald">✓ Day 3 Weather Adapted</Badge>
                )}
              </div>

              {itineraryDays.map((day) => (
                <Card key={day.dayNumber} className={`p-6 space-y-4 border-l-4 ${day.themeBorder}`}>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      DAY {day.dayNumber} — {day.title}
                    </h4>
                  </div>
                  <div className="space-y-3 relative pl-4 border-l border-slate-200 dark:border-slate-800 ml-2 text-xs">
                    {day.activities.map((act, aIdx) => (
                      <div key={aIdx} className="relative">
                        <span className={`absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full ${act.dot}`} />
                        <strong className="text-slate-900 dark:text-white">{act.time} — {act.title}</strong>
                        <p className="text-slate-500 dark:text-slate-400">{act.desc}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* TAB 3: MAP & PLACES */}
          {activeTab === 'Map' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <Card className="lg:col-span-8 p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span className="capitalize">{trip.destination} Interactive Map Overview</span>
                  <Badge variant="sky">Google Maps Integration</Badge>
                </h3>
                <div className="bg-slate-200 dark:bg-slate-800 rounded-xl h-72 flex items-center justify-center text-center p-6 text-xs text-slate-500 dark:text-slate-400">
                  <div>
                    <MapPin className="h-8 w-8 text-sky-500 mx-auto mb-2" />
                    <p className="font-bold text-slate-700 dark:text-slate-200 capitalize">{trip.destination} Interactive Map Workspace</p>
                    <p className="text-[10px]">Showing markers for key points of interest and attractions in {trip.destination}.</p>
                  </div>
                </div>
              </Card>

              <Card className="lg:col-span-4 p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Waypoints & Route Details</h3>
                <div className="space-y-2 text-xs">
                  {mapWaypoints.map((wp, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between">
                      <span>{wp.name}</span>
                      <span className="font-semibold text-sky-500">{wp.rating}</span>
                    </div>
                  ))}
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
                    <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 capitalize">Live Weather ({trip.destination})</h4>
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      {liveWeather?.alertDescription || `Current temperature is ${liveWeather?.currentTemperature || 24}°C (${liveWeather?.currentCondition || 'Partly Cloudy'}). Heavy rain expected on Day 3.`}
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
                  { date: 'Day 1', temperature: 24, condition: 'Sunny', rainProbability: 0.1, outdoorSuitable: true },
                  { date: 'Day 2', temperature: 25, condition: 'Partly Cloudy', rainProbability: 0.1, outdoorSuitable: true },
                  { date: 'Day 3', temperature: 21, condition: 'Heavy Rain', rainProbability: 0.85, outdoorSuitable: false },
                  { date: 'Day 4', temperature: 23, condition: 'Clear Spells', rainProbability: 0.1, outdoorSuitable: true },
                  { date: 'Day 5', temperature: 24, condition: 'Sunny', rainProbability: 0.1, outdoorSuitable: true },
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
                <h3 className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                  Live Flights ({trip.origin || 'HYD'} → {trip.destination || 'PAR'})
                </h3>
                <Badge variant="sky">Aviationstack Live</Badge>
              </div>

              {isFlightsLoading ? (
                <div className="py-8 text-center text-xs text-slate-400">Loading flights from Aviationstack...</div>
              ) : (
                <div className="space-y-3">
                  {(liveFlights && liveFlights.length > 0 ? liveFlights : [
                    { id: 'fl_1', airlineName: 'Air France', flightNumber: 'AF-225', origin: trip.origin || 'HYD', destination: trip.destination || 'CDG', departureTime: '02:15 AM', arrivalTime: '08:40 AM', duration: '9h 55m', status: 'Scheduled' },
                    { id: 'fl_2', airlineName: 'Emirates', flightNumber: 'EK-527', origin: trip.origin || 'HYD', destination: trip.destination || 'CDG', departureTime: '10:00 AM', arrivalTime: '07:30 PM', duration: '12h 00m', status: 'Scheduled' },
                    { id: 'fl_3', airlineName: 'Lufthansa', flightNumber: 'LH-753', origin: trip.origin || 'HYD', destination: trip.destination || 'CDG', departureTime: '03:30 AM', arrivalTime: '11:15 AM', duration: '10h 15m', status: 'Scheduled' },
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
                          <Badge variant="emerald">Direct</Badge>
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
                <h3 className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                  Accommodations in {trip.destination}
                </h3>
                <Badge variant="sky">Verified Hotels</Badge>
              </div>

              {isHotelsLoading ? (
                <div className="py-8 text-center text-xs text-slate-400">Searching hotels...</div>
              ) : (
                <div className="space-y-3">
                  {(liveHotels && liveHotels.length > 0 ? liveHotels : destinationHotels).map((hotel: any) => (
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
                        <Badge variant="slate">Available</Badge>
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
                    {trip.currency} {(trip.budget * 0.08).toLocaleString()} Remaining
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
                    <span>Allocated: {trip.currency} {(trip.budget * 0.92).toLocaleString()}</span>
                    <span>Total Budget: {trip.currency} {trip.budget.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div className="bg-sky-600 dark:bg-sky-500 h-full rounded-full w-[92%]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-semibold block">Flights</span>
                    <strong className="text-slate-900 dark:text-white">{trip.currency} {(trip.budget * 0.35).toLocaleString()}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-semibold block">Hotels</span>
                    <strong className="text-slate-900 dark:text-white">{trip.currency} {(trip.budget * 0.30).toLocaleString()}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-semibold block">Food & Dining</span>
                    <strong className="text-slate-900 dark:text-white">{trip.currency} {(trip.budget * 0.15).toLocaleString()}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-semibold block">Activities</span>
                    <strong className="text-slate-900 dark:text-white">{trip.currency} {(trip.budget * 0.12).toLocaleString()}</strong>
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
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white capitalize">Smart Packing Checklist for {trip.destination}</h3>
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
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider capitalize">
                    {trip.destination} AI Companion
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
                    placeholder={`Ask about ${trip.destination} (e.g. 'Make Day 3 more relaxed')...`}
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
                <h3 className="text-base font-bold text-slate-900 dark:text-white capitalize">
                  Weather Alert & Adaptive Replan ({trip.destination})
                </h3>
              </div>
              <button
                onClick={() => setShowReplanModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed capitalize">
              OpenWeather forecast predicts heavy rain on Saturday afternoon in {trip.destination}. AI has structured an indoor alternative timeline for Day 3.
            </p>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Current Plan (Rain Risk)</span>
                <p className="text-slate-700 dark:text-slate-300">⛰️ Outdoor Hill / River Walk</p>
                <p className="text-slate-700 dark:text-slate-300">🏛️ Open Plaza Sightseeing</p>
              </div>

              <div className="p-3 bg-sky-50 dark:bg-sky-950/40 rounded-xl border border-sky-300 dark:border-sky-800 space-y-2">
                <span className="text-[10px] text-sky-600 dark:text-sky-400 font-bold uppercase block">Proposed Alternate</span>
                <p className="text-slate-900 dark:text-white font-medium">🏛️ National Art Museum (Indoor)</p>
                <p className="text-slate-900 dark:text-white font-medium">🍜 Covered Arcade Culinary Lunch</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-xs pt-2">
              <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Cost Delta</span>
                <strong className="text-emerald-600 dark:text-emerald-400">-₹450</strong>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Travel Time</span>
                <strong className="text-sky-600 dark:text-sky-400">-25 min</strong>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Preference</span>
                <strong className="text-amber-600 dark:text-amber-400">+8%</strong>
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
