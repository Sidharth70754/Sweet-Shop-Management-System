import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Sweet = Database['public']['Tables']['sweets']['Row'];
type SweetInsert = Database['public']['Tables']['sweets']['Insert'];
type SweetUpdate = Database['public']['Tables']['sweets']['Update'];

interface SweetsFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface PaginationOptions {
  page: number;
  pageSize: number;
}

interface UseSweetsReturn {
  sweets: Sweet[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  categories: string[];
  fetchSweets: (filters?: SweetsFilters, pagination?: PaginationOptions) => Promise<void>;
  createSweet: (sweet: SweetInsert) => Promise<{ data: Sweet | null; error: string | null }>;
  updateSweet: (id: string, updates: SweetUpdate) => Promise<{ data: Sweet | null; error: string | null }>;
  deleteSweet: (id: string) => Promise<{ error: string | null }>;
  restockSweet: (id: string, quantity: number) => Promise<{ data: Sweet | null; error: string | null }>;
}

export function useSweets(): UseSweetsReturn {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from('sweets')
      .select('category')
      .order('category');

    if (!error && data) {
      const uniqueCategories = [...new Set(data.map(s => s.category))];
      setCategories(uniqueCategories);
    }
  }, []);

  const fetchSweets = useCallback(async (
    filters: SweetsFilters = {},
    pagination: PaginationOptions = { page: 1, pageSize: 12 }
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('useSweets: Starting fetch with filters:', filters, 'pagination:', pagination);
      
      // Check if Supabase client is properly initialized
      if (!supabase) {
        throw new Error('Supabase client is not initialized');
      }

      // Fetch sweets with proper error handling
      let query = supabase
        .from('sweets')
        .select('*', { count: 'exact' });
      
      // Ensure we're getting all sweets (no limit before filters)
      // Pagination will be applied after filters

      // Apply filters
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.minPrice !== undefined && filters.minPrice !== null) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
        query = query.lte('price', filters.maxPrice);
      }

      // Apply pagination
      const from = (pagination.page - 1) * pagination.pageSize;
      const to = from + pagination.pageSize - 1;
      query = query.range(from, to).order('name', { ascending: true });

      const { data, error: queryError, count } = await query;

      if (queryError) {
        console.error('Supabase query error:', queryError);
        console.error('Error details:', {
          message: queryError.message,
          details: queryError.details,
          hint: queryError.hint,
          code: queryError.code
        });
        
        // Provide more helpful error messages
        let helpfulMessage = queryError.message;
        
        if (queryError.message?.includes('relation') && queryError.message?.includes('does not exist')) {
          helpfulMessage = 'Database tables not found. Please run migrations in your Supabase project.';
        } else if (queryError.message?.includes('permission denied') || queryError.code === '42501') {
          helpfulMessage = 'Permission denied. You may need to sign in or check RLS policies.';
        } else if (queryError.message?.includes('JWT') || queryError.message?.includes('Invalid API key')) {
          helpfulMessage = 'Invalid API key. Please check your .env file configuration.';
        } else if (queryError.hint) {
          helpfulMessage = `${queryError.message} (Hint: ${queryError.hint})`;
        }
        
        const errorWithMessage = new Error(helpfulMessage);
        (errorWithMessage as any).originalError = queryError;
        throw errorWithMessage;
      }

      console.log('useSweets: Successfully fetched sweets:', {
        count: data?.length || 0,
        totalCount: count || 0,
        data: data
      });
      
      setSweets(data || []);
      setTotalCount(count || 0);
      
      if (!data || data.length === 0) {
        console.log('useSweets: No sweets found in database');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sweets';
      console.error('useSweets: Error in fetchSweets:', err);
      
      // Add more context to error message
      let enhancedMessage = errorMessage;
      if (err instanceof Error && (err as any).originalError) {
        const originalError = (err as any).originalError;
        if (originalError.code) {
          enhancedMessage += ` (Error code: ${originalError.code})`;
        }
      }
      
      setError(enhancedMessage);
      setSweets([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSweet = async (sweet: SweetInsert) => {
    try {
      const { data, error } = await supabase
        .from('sweets')
        .insert(sweet)
        .select()
        .single();

      if (error) {
        console.error('Error creating sweet:', error);
        throw error;
      }

      // Update local state
      setSweets(prev => [...prev, data]);
      // Refresh categories
      await fetchCategories();
      // Refresh total count
      setTotalCount(prev => prev + 1);
      
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create sweet';
      console.error('createSweet error:', err);
      return { data: null, error: message };
    }
  };

  const updateSweet = async (id: string, updates: SweetUpdate) => {
    try {
      const { data, error } = await supabase
        .from('sweets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSweets(prev => prev.map(s => s.id === id ? data : s));
      await fetchCategories();
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update sweet';
      return { data: null, error: message };
    }
  };

  const deleteSweet = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sweets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSweets(prev => prev.filter(s => s.id !== id));
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete sweet';
      return { error: message };
    }
  };

  const restockSweet = async (id: string, quantity: number) => {
    try {
      const sweet = sweets.find(s => s.id === id);
      if (!sweet) throw new Error('Sweet not found');

      const newQuantity = sweet.quantity + quantity;
      
      const { data, error } = await supabase
        .from('sweets')
        .update({ quantity: newQuantity })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSweets(prev => prev.map(s => s.id === id ? data : s));
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to restock sweet';
      return { data: null, error: message };
    }
  };

  // Initial fetch on mount - this ensures data is loaded when hook is first used
  useEffect(() => {
    console.log('useSweets: Hook mounted, fetching initial data...');
    const initializeData = async () => {
      await fetchSweets({}, { page: 1, pageSize: 12 });
      await fetchCategories();
    };
    initializeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    sweets,
    totalCount,
    isLoading,
    error,
    categories,
    fetchSweets,
    createSweet,
    updateSweet,
    deleteSweet,
    restockSweet,
  };
}
