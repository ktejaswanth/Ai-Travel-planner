import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Calendar, Compass, DollarSign, MapPin, Plus, Trash2, Users } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { tripService } from '../../services/tripService';
import { Trip, TripStatus } from '../../types/trip';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Toast, ToastMessage } from '../../components/ui/Toast';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'ALL' | 'UPCOMING' | 'PAST' | 'PLANNING'>('ALL');
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Fetch Trips via TanStack Query
  const { data: trips = [], isLoading, isError, refetch } = useQuery<Trip[]>({
    queryKey: ['trips'],
    queryFn: tripService.getTrips,
  });

  // Delete Trip Mutation
  const deleteMutation = useMutation({
    mutationFn: (tripId: string) => tripService.deleteTrip(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      setToast({
        id: Date.now().toString(),
        type: 'success',
        title: 'Trip Deleted',
        message: 'The trip has been removed from your dashboard.',
      });
      setTripToDelete(null);
    },
    onError: (err: any) => {
      setToast({
        id: Date.now().toString(),
        type: 'error',
        title: 'Delete Failed',
        message: err.response?.data?.message || 'Could not delete trip',
      });
    },
  });

  const today = new Date().toISOString().split('T')[0];

  const upcomingTrips = trips.filter((t) => t.startDate >= today && t.status !== 'CANCELLED');
  const pastTrips = trips.filter((t) => t.endDate < today || t.status === 'COMPLETED');
  const planningTrips = trips.filter((t) => t.status === 'PLANNING' || t.status === 'DRAFT');

  const filteredTrips = trips.filter((trip) => {
    if (activeTab === 'UPCOMING') return trip.startDate >= today && trip.status !== 'CANCELLED';
    if (activeTab === 'PAST') return trip.endDate < today || trip.status === 'COMPLETED';
    if (activeTab === 'PLANNING') return trip.status === 'PLANNING' || trip.status === 'DRAFT';
    return true;
  });

  const getStatusBadge = (status: TripStatus) => {
    switch (status) {
      case 'DRAFT':
        return <Badge variant="slate">Draft</Badge>;
      case 'PLANNING':
        return <Badge variant="sky">Planning</Badge>;
      case 'READY':
        return <Badge variant="emerald">Ready</Badge>;
      case 'COMPLETED':
        return <Badge variant="indigo">Completed</Badge>;
      case 'CANCELLED':
        return <Badge variant="rose">Cancelled</Badge>;
      default:
        return <Badge variant="slate">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      {toast && (
        <div className="fixed top-20 right-5 z-50">
          <Toast toast={toast} onClose={() => setToast(null)} />
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Welcome Header & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Welcome back, <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">{user?.name}</span>!
            </h1>
            <p className="text-sm text-slate-400 mt-1">Here is an overview of your planned adventures and trips.</p>
          </div>
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Plus className="h-5 w-5" />}
            onClick={() => navigate('/trips/create')}
            className="shadow-xl shadow-sky-500/20 shrink-0"
          >
            Create New Trip
          </Button>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
            <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Trips</p>
              <h3 className="text-2xl font-bold text-white">{trips.length}</h3>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Upcoming Trips</p>
              <h3 className="text-2xl font-bold text-white">{upcomingTrips.length}</h3>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Past & Completed</p>
              <h3 className="text-2xl font-bold text-white">{pastTrips.length}</h3>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto">
          {[
            { key: 'ALL', label: `All Trips (${trips.length})` },
            { key: 'UPCOMING', label: `Upcoming (${upcomingTrips.length})` },
            { key: 'PLANNING', label: `Planning (${planningTrips.length})` },
            { key: 'PAST', label: `Past (${pastTrips.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading State Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-panel p-6 rounded-2xl space-y-4">
                <div className="h-6 w-3/4 animate-skeleton"></div>
                <div className="h-4 w-1/2 animate-skeleton"></div>
                <div className="h-10 w-full animate-skeleton"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="glass-panel p-8 rounded-2xl text-center border-rose-500/30 space-y-4">
            <p className="text-rose-400 font-medium">Failed to load your trips. Please check your connection.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && filteredTrips.length === 0 && (
          <div className="glass-panel p-12 rounded-2xl text-center border-dashed border-slate-800 space-y-5 max-w-lg mx-auto">
            <div className="p-4 bg-sky-500/10 text-sky-400 rounded-full w-fit mx-auto">
              <Compass className="h-10 w-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">No trips found</h3>
              <p className="text-sm text-slate-400 mt-1">
                {activeTab === 'ALL'
                  ? "You haven't created any trips yet. Start planning your next adventure!"
                  : `No trips found in the '${activeTab.toLowerCase()}' category.`}
              </p>
            </div>
            <Button variant="primary" size="md" onClick={() => navigate('/trips/create')}>
              Create Your First Trip
            </Button>
          </div>
        )}

        {/* Trips Grid */}
        {!isLoading && !isError && filteredTrips.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <Card key={trip.id} hoverEffect className="flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xl font-bold text-white tracking-tight line-clamp-1">{trip.title}</h3>
                    {getStatusBadge(trip.status)}
                  </div>

                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-sky-400 shrink-0" />
                      <span className="font-semibold text-slate-200">{trip.destination}</span>
                      {trip.origin && <span className="text-slate-400">(from {trip.origin})</span>}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>
                        {trip.startDate} → {trip.endDate}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 pt-1">
                      <div className="flex items-center space-x-1.5">
                        <Users className="h-4 w-4 text-amber-400 shrink-0" />
                        <span>{trip.travelers} Traveler{trip.travelers > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <DollarSign className="h-4 w-4 text-indigo-400 shrink-0" />
                        <span>
                          {trip.currency} {trip.budget.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {trip.preferences?.interests && trip.preferences.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {trip.preferences.interests.slice(0, 3).map((interest) => (
                        <span key={interest} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300">
                          {interest}
                        </span>
                      ))}
                      {trip.preferences.interests.length > 3 && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-400">
                          +{trip.preferences.interests.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/trips/${trip.id}`)}
                  >
                    View Details
                  </Button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTripToDelete(trip);
                    }}
                    title="Delete Trip"
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!tripToDelete}
        onClose={() => setTripToDelete(null)}
        title="Confirm Trip Deletion"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Are you sure you want to delete <strong className="text-white">{tripToDelete?.title}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setTripToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={deleteMutation.isPending}
              onClick={() => tripToDelete && deleteMutation.mutate(tripToDelete.id)}
            >
              Delete Trip
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};
