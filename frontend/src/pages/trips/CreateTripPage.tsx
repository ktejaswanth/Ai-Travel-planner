import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Compass,
  DollarSign,
  Heart,
  MapPin,
  Sparkles,
  Users,
} from 'lucide-react';
import { tripService } from '../../services/tripService';
import { CreateTripRequest, Interest } from '../../types/trip';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Toast, ToastMessage } from '../../components/ui/Toast';

const INTEREST_OPTIONS: { id: Interest; label: string; icon: string }[] = [
  { id: 'BEACH', label: 'Beach & Ocean', icon: '🏖️' },
  { id: 'ADVENTURE', label: 'Adventure & Sports', icon: '🧗' },
  { id: 'NATURE', label: 'Nature & Wildlife', icon: '🌿' },
  { id: 'CULTURE', label: 'Culture & Arts', icon: '🎭' },
  { id: 'HISTORY', label: 'History & Heritage', icon: '🏛️' },
  { id: 'FOOD', label: 'Food & Culinary', icon: '🍕' },
  { id: 'NIGHTLIFE', label: 'Nightlife & Clubs', icon: '🍸' },
  { id: 'SHOPPING', label: 'Shopping & Markets', icon: '🛍️' },
  { id: 'PHOTOGRAPHY', label: 'Photography', icon: '📸' },
  { id: 'RELAXATION', label: 'Relaxation & Spa', icon: '🧘' },
];

export const CreateTripPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<number>(1);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Form State
  const [destination, setDestination] = useState<string>('');
  const [origin, setOrigin] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [travelers, setTravelers] = useState<number>(2);
  const [budget, setBudget] = useState<number>(30000);
  const [currency, setCurrency] = useState<string>('INR');

  // Preferences State
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>(['BEACH', 'FOOD']);
  const [travelStyle, setTravelStyle] = useState<string>('Balanced');
  const [pace, setPace] = useState<string>('Moderate');
  const [accommodationPreference, setAccommodationPreference] = useState<string>('Resort');
  const [transportPreference, setTransportPreference] = useState<string>('Flight & Rental');
  const [dietaryPreference, setDietaryPreference] = useState<string>('None');
  const [specialRequirements, setSpecialRequirements] = useState<string>('');

  const createTripMutation = useMutation({
    mutationFn: (payload: CreateTripRequest) => tripService.createTrip(payload),
    onSuccess: (newTrip) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      navigate(`/trips/${newTrip.id}`);
    },
    onError: (err: any) => {
      const errorMsg = err.response?.data?.message || 'Failed to save trip';
      setToast({
        id: Date.now().toString(),
        type: 'error',
        title: 'Validation Error',
        message: errorMsg,
      });
    },
  });

  const toggleInterest = (interest: Interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (!destination.trim()) {
        setToast({ id: '1', type: 'error', title: 'Destination Required', message: 'Please enter a trip destination.' });
        return false;
      }
    } else if (currentStep === 2) {
      if (!startDate || !endDate) {
        setToast({ id: '2', type: 'error', title: 'Dates Required', message: 'Please select both start and end dates.' });
        return false;
      }
      if (new Date(endDate) < new Date(startDate)) {
        setToast({ id: '2', type: 'error', title: 'Invalid Dates', message: 'End date cannot be before start date.' });
        return false;
      }
    } else if (currentStep === 3) {
      if (travelers < 1) {
        setToast({ id: '3', type: 'error', title: 'Invalid Travelers', message: 'Travelers count must be at least 1.' });
        return false;
      }
    } else if (currentStep === 4) {
      if (budget < 0) {
        setToast({ id: '4', type: 'error', title: 'Invalid Budget', message: 'Budget cannot be negative.' });
        return false;
      }
    }
    setToast(null);
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 7));
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    const payload: CreateTripRequest = {
      title: title.trim() || `Trip to ${destination}`,
      origin: origin.trim() || undefined,
      destination: destination.trim(),
      startDate,
      endDate,
      travelers,
      budget,
      currency,
      preferences: {
        interests: selectedInterests,
        travelStyle,
        pace,
        accommodationPreference,
        transportPreference,
        dietaryPreference,
        specialRequirements: specialRequirements.trim() || undefined,
      },
    };
    createTripMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      {toast && (
        <div className="fixed top-20 right-5 z-50">
          <Toast toast={toast} onClose={() => setToast(null)} />
        </div>
      )}

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Step Progress Header */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-sky-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Create New Trip</h1>
              <p className="text-sm text-slate-400">Step {step} of 7 — {getStepTitle(step)}</p>
            </div>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    s === step
                      ? 'w-8 bg-sky-500'
                      : s < step
                      ? 'w-3 bg-emerald-500'
                      : 'w-3 bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Wizard Form Cards */}
        <Card className="border-slate-800 p-8 shadow-2xl">
          {/* STEP 1: Destination */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <MapPin className="h-5 w-5 text-sky-400 mr-2" /> Where are you traveling?
                </h3>
                <p className="text-sm text-slate-400">Specify your main trip destination and starting origin city.</p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Destination *"
                  placeholder="e.g., Goa, India or Paris, France"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />

                <Input
                  label="Origin City (Optional)"
                  placeholder="e.g., Hyderabad or New York"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                />

                <Input
                  label="Trip Title (Optional)"
                  placeholder={`e.g., ${destination ? `${destination} Gateway` : 'Summer Vacation'}`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 2: Dates */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <Calendar className="h-5 w-5 text-emerald-400 mr-2" /> When are you going?
                </h3>
                <p className="text-sm text-slate-400">Select your travel start and end dates.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Start Date *"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />

                <Input
                  label="End Date *"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 3: Travelers */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <Users className="h-5 w-5 text-amber-400 mr-2" /> Who is traveling?
                </h3>
                <p className="text-sm text-slate-400">Select the number of travelers for this trip.</p>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-semibold text-slate-300 uppercase">Number of Travelers</label>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setTravelers((prev) => Math.max(1, prev - 1))}
                    className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xl flex items-center justify-center border border-slate-700"
                  >
                    -
                  </button>
                  <span className="text-3xl font-extrabold text-white w-16 text-center">{travelers}</span>
                  <button
                    type="button"
                    onClick={() => setTravelers((prev) => prev + 1)}
                    className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xl flex items-center justify-center border border-slate-700"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Budget */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <DollarSign className="h-5 w-5 text-indigo-400 mr-2" /> What is your budget?
                </h3>
                <p className="text-sm text-slate-400">Set your overall total budget limit.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Total Budget *"
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Preferences */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <Heart className="h-5 w-5 text-rose-400 mr-2" /> Personal Preferences
                </h3>
                <p className="text-sm text-slate-400">Customize your interests, pace, and accommodation style.</p>
              </div>

              {/* Interests Multi-Select */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase">Interests & Activities</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {INTEREST_OPTIONS.map((item) => {
                    const isSelected = selectedInterests.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleInterest(item.id)}
                        className={`p-3 rounded-xl border text-left text-xs font-medium flex items-center space-x-2 transition-all ${
                          isSelected
                            ? 'bg-sky-500/20 border-sky-500 text-sky-300 shadow-md shadow-sky-500/10'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dropdowns for Style & Pace */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Travel Pace</label>
                  <select
                    value={pace}
                    onChange={(e) => setPace(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="Relaxed">Relaxed (Slow & easy)</option>
                    <option value="Moderate">Moderate (Balanced)</option>
                    <option value="Fast-paced">Fast-paced (See everything)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Accommodation Preference</label>
                  <select
                    value={accommodationPreference}
                    onChange={(e) => setAccommodationPreference(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="Hotel">Hotel</option>
                    <option value="Resort">Resort</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Apartment">Apartment / Airbnb</option>
                    <option value="Boutique">Boutique Hotel</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Review */}
          {step === 6 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <Compass className="h-5 w-5 text-sky-400 mr-2" /> Review Trip Parameters
                </h3>
                <p className="text-sm text-slate-400">Review your trip configuration before creating.</p>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 text-sm text-slate-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-xs uppercase text-slate-400 font-semibold block">Destination</span>
                    <strong className="text-white text-base">{destination}</strong>
                    {origin && <span className="text-slate-400 block text-xs">From: {origin}</span>}
                  </div>
                  <div>
                    <span className="text-xs uppercase text-slate-400 font-semibold block">Dates</span>
                    <strong className="text-white text-base">{startDate} → {endDate}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-xs uppercase text-slate-400 font-semibold block">Travelers</span>
                    <strong className="text-white">{travelers} Person(s)</strong>
                  </div>
                  <div>
                    <span className="text-xs uppercase text-slate-400 font-semibold block">Budget</span>
                    <strong className="text-white">{currency} {budget.toLocaleString()}</strong>
                  </div>
                </div>

                <div>
                  <span className="text-xs uppercase text-slate-400 font-semibold block mb-1">Selected Interests</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedInterests.map((i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs">
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Ready / Submit */}
          {step === 7 && (
            <div className="space-y-6 text-center animate-in fade-in duration-200 py-6">
              <div className="w-16 h-16 bg-gradient-to-tr from-sky-500 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-sky-500/30">
                <Sparkles className="h-8 w-8 text-white" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-white">Your Trip is Ready to Create!</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  Click below to save this trip to your account dashboard. You can later integrate Gemini AI and live Google Places.
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                isLoading={createTripMutation.isPending}
                onClick={handleSubmit}
                className="px-10 py-4 text-lg shadow-xl shadow-sky-500/30"
              >
                Create Trip Now
              </Button>
            </div>
          )}

          {/* Step Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <Button variant="outline" size="md" onClick={prevStep}>
                Previous
              </Button>
            ) : (
              <div />
            )}

            {step < 7 && (
              <Button variant="primary" size="md" rightIcon={<ArrowRight className="h-4 w-4" />} onClick={nextStep}>
                Next Step
              </Button>
            )}
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

function getStepTitle(step: number): string {
  switch (step) {
    case 1: return 'Destination & Title';
    case 2: return 'Travel Dates';
    case 3: return 'Traveler Count';
    case 4: return 'Budget & Currency';
    case 5: return 'Preferences & Interests';
    case 6: return 'Review Configuration';
    case 7: return 'Confirm & Save';
    default: return '';
  }
}
