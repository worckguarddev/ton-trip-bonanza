
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Trip {
  id: string;
  title: string;
  description: string | null;
  from_location: string;
  to_location: string;
  departure_date: string;
  return_date: string | null;
  price: number | null;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  bonus_earned: number | null;
  created_at: string;
  updated_at: string;
}

export const useTrips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = async (telegramId: number) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_telegram_id', telegramId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrips(data || []);
    } catch (err) {
      console.error('Error fetching trips:', err);
      setError(err instanceof Error ? err.message : 'Ошибка загрузки поездок');
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async (tripData: Omit<Trip, 'id' | 'created_at' | 'updated_at'> & { user_telegram_id: number }) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('trips')
        .insert(tripData)
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Поездка создана!');
      return data;
    } catch (err) {
      console.error('Error creating trip:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка создания поездки';
      toast.error(errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateTripStatus = async (tripId: string, status: Trip['status']) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('trips')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', tripId);

      if (error) throw error;
      
      toast.success('Статус поездки обновлен');
      return true;
    } catch (err) {
      console.error('Error updating trip status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка обновления статуса';
      toast.error(errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    trips,
    loading,
    error,
    fetchTrips,
    createTrip,
    updateTripStatus
  };
};
