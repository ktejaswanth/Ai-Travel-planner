import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CloudRain,
  Compass,
  DollarSign,
  Hotel,
  MapPin,
  Plane,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Sun,
  Utensils,
  Zap,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../features/auth/AuthContext';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [demoState, setDemoState] = useState<'BEFORE' | 'AFTER'>('BEFORE');
  const [isReplanning, setIsReplanning] = useState(false);

  const handleCtaClick = () => {
    if (isAuthenticated) {
      navigate('/trips/create');
    } else {
      navigate('/register');
    }
  };

  const handleTriggerReplan = () => {
    setIsReplanning(true);
    setTimeout(() => {
      setDemoState((prev) => (prev === 'BEFORE' ? 'AFTER' : 'BEFORE'));
      setIsReplanning(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 text-sky-700 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI-Powered Adaptive Travel Planning</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Plan your trip.{' '}
                <span className="text-sky-600 dark:text-sky-400 block mt-1">Let AI handle the rest.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-xl">
                Personalized itineraries, smart budgets, real-time travel data, and intelligent adaptive replanning — all in one unified workspace.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Button
                  size="lg"
                  variant="primary"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                  onClick={handleCtaClick}
                  className="w-full sm:w-auto shadow-md"
                >
                  Plan My Trip Now →
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    const el = document.getElementById('adaptive-demo');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto"
                >
                  See How AI Adapts
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-4 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <Zap className="h-4 w-4 text-sky-500" />
                  <span>Instant Itineraries</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Budget Optimized</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <RefreshCw className="h-4 w-4 text-indigo-500" />
                  <span>Weather Adaptive</span>
                </div>
              </div>
            </div>

            {/* Right Hero Interactive Preview Widget */}
            <div className="lg:col-span-5">
              <Card className="p-6 shadow-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                  <div>
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Live Preview</span>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Goa Beach & Culture • 5 Days</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Trip Health</span>
                    <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                      91 / 100
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Day 3 Schedule</span>
                    {demoState === 'BEFORE' ? (
                      <span className="flex items-center text-amber-600 dark:text-amber-400 font-medium">
                        <Sun className="h-3.5 w-3.5 mr-1" /> Clear Weather Planned
                      </span>
                    ) : (
                      <span className="flex items-center text-sky-600 dark:text-sky-400 font-medium">
                        <CloudRain className="h-3.5 w-3.5 mr-1" /> Weather Adapted ✓
                      </span>
                    )}
                  </div>

                  {demoState === 'BEFORE' ? (
                    <div className="space-y-2">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="text-base">🏄</span>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-slate-100">Baga Water Sports</p>
                            <p className="text-[10px] text-slate-500">Outdoor • 10:00 AM</p>
                          </div>
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">₹1,500</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="text-base">🏖️</span>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-slate-100">Calangute Beach Walk</p>
                            <p className="text-[10px] text-slate-500">Outdoor • 02:00 PM</p>
                          </div>
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">₹0</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="p-2.5 rounded-xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="text-base">🏛️</span>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-slate-100">Goa State Museum</p>
                            <p className="text-[10px] text-sky-600 dark:text-sky-400 font-medium">Indoor Alternate • 10:00 AM</p>
                          </div>
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">₹300</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="text-base">🍜</span>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-slate-100">Spice Plantation Tour & Lunch</p>
                            <p className="text-[10px] text-sky-600 dark:text-sky-400 font-medium">Covered Pavilion • 01:30 PM</p>
                          </div>
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">₹750</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Budget Spent: <strong>₹27,400 / ₹30,000</strong></span>
                    <Button
                      size="sm"
                      variant={demoState === 'BEFORE' ? 'primary' : 'outline'}
                      onClick={handleTriggerReplan}
                      isLoading={isReplanning}
                    >
                      {demoState === 'BEFORE' ? 'Simulate Rain & Replan 🌧️' : 'Reset Demo'}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-white dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Travel planning shouldn't feel like another job.
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm">
              Traditional trip planning is fragmented, static, and vulnerable to unexpected changes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
              <div className="text-2xl">🌐</div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Too Many Apps</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Flights, hotels, maps, weather, and activities are scattered across multiple platforms.
              </p>
            </Card>

            <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
              <div className="text-2xl">💰</div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Budget Uncertainty</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Hard to know whether your actual travel activities strictly fit your budget caps.
              </p>
            </Card>

            <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
              <div className="text-2xl">⏰</div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Time Consuming</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Hours spent searching, comparing, and organizing daily timelines manually.
              </p>
            </Card>

            <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
              <div className="text-2xl">🌧️</div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Plans Change</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Sudden weather shifts or venue closures ruin carefully constructed itineraries.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Adaptive Replanning WOW Section */}
      <section id="adaptive-demo" className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
            <Badge variant="sky">The WOW Feature</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Your itinerary adapts with you in real-time.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xl mx-auto">
              When bad weather or travel disruptions hit, TripWise AI automatically recalculates routes, costs, and indoor alternatives.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
            {/* Before vs After Card */}
            <div className="bg-slate-800/90 border border-slate-700 p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <span className="text-xs font-semibold text-rose-400 flex items-center">
                  <CloudRain className="h-4 w-4 mr-1.5" /> Weather Alert Detected
                </span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-bold">
                  Day 3 Heavy Rain
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/80 space-y-2">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Before (Ruined by Rain)</p>
                  <p className="text-slate-300">🏄 Outdoor Watersports</p>
                  <p className="text-slate-300">🏖️ Beach Relaxation</p>
                  <p className="text-slate-300">🏰 Fort Sunset View</p>
                </div>
                <div className="bg-sky-950/60 p-3 rounded-xl border border-sky-600/40 space-y-2">
                  <p className="text-[10px] text-sky-400 font-bold uppercase">After AI Replan</p>
                  <p className="text-white font-medium">🏛️ Art & Heritage Museum</p>
                  <p className="text-white font-medium">🍜 Local Food Experience</p>
                  <p className="text-white font-medium">☕ Covered Café & Photography</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs border-t border-slate-700">
                <div className="bg-slate-900/60 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Budget</span>
                  <strong className="text-emerald-400">-₹450</strong>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Travel</span>
                  <strong className="text-sky-400">-31 min</strong>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Preference</span>
                  <strong className="text-amber-400">+6%</strong>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Safety</span>
                  <strong className="text-emerald-400">✓ Safe</strong>
                </div>
              </div>
            </div>

            {/* Explanation Right */}
            <div className="space-y-6 text-left">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">Constraint-Aware Intelligence</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Unlike static generators, TripWise evaluates live weather APIs, transit matrix times, and price caps before proposing an updated plan.
                </p>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start space-x-3">
                  <div className="p-1.5 bg-sky-500/20 text-sky-400 rounded-lg mt-0.5">
                    <Compass className="h-4 w-4" />
                  </div>
                  <div>
                    <strong className="text-white block">Automatic Alternatives</strong>
                    <span>Swaps affected outdoor activities for top-rated indoor cultural and dining spots.</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg mt-0.5">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div>
                    <strong className="text-white block">Strict Budget Grounding</strong>
                    <span>Ensures alternative options never breach your total trip budget cap.</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg mt-0.5">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <strong className="text-white block">User Approval Required</strong>
                    <span>Review changes side-by-side before confirming modifications to your itinerary.</span>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                onClick={handleCtaClick}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Try Adaptive Replanning →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Features Grid */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              One Intelligent Travel Workspace
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm">
              Six core modules designed to seamlessly orchestrate your complete travel experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-3">
              <div className="p-2.5 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-xl w-fit">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">✨ AI Itinerary</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Personalized day-by-day plans tailored strictly to your pace, dietary preferences, and style.
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit">
                <DollarSign className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">💰 Smart Budget</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Know exactly where your money goes with category breakdowns for lodging, food, and activities.
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <div className="p-2.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl w-fit">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">🗺️ Smart Routes</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Optimize daily transit sequence to minimize travel times between consecutive stops.
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <div className="p-2.5 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-xl w-fit">
                <Sun className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">☁️ Weather-Aware</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Real-time OpenWeather integration ensures outdoor activities align with forecast safety.
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit">
                <Plane className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">✈️ Flights & Hotels</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Compare flight routes and lodging choices directly inside your trip dashboard.
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <div className="p-2.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl w-fit">
                <RefreshCw className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">🔄 Adaptive Replanning</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                When weather or schedules change unexpectedly, AI adapts your timeline in seconds.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Tech Stack Trust Bar */}
      <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
            Powered By Production-Grade Infrastructure
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-bold text-slate-600 dark:text-slate-300">
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">Gemini AI</span>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">Google Places</span>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">Google Maps</span>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">OpenWeather</span>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">MongoDB Atlas</span>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">Spring Boot 3</span>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">React 18 & Vite</span>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-sky-600/10 dark:bg-sky-950/40">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Ready to travel smarter?
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm max-w-xl mx-auto">
            Create your first intelligent trip in under 60 seconds with TripWise AI.
          </p>
          <div className="pt-2">
            <Button
              size="lg"
              variant="primary"
              rightIcon={<ArrowRight className="h-5 w-5" />}
              onClick={handleCtaClick}
            >
              Plan My Trip →
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
