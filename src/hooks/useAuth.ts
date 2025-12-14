import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface AuthState {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  isLoading: boolean;
  isAdmin: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    role: null,
    isLoading: true,
    isAdmin: false,
  });

  const fetchUserRole = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }

      return data?.role ?? null;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          isLoading: false,
        }));

        // Defer role fetch with setTimeout to prevent deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchUserRole(session.user.id).then(role => {
              setAuthState(prev => ({
                ...prev,
                role,
                isAdmin: role === 'admin',
              }));
            });
          }, 0);
        } else {
          setAuthState(prev => ({
            ...prev,
            role: null,
            isAdmin: false,
          }));
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        isLoading: false,
      }));

      if (session?.user) {
        fetchUserRole(session.user.id).then(role => {
          setAuthState(prev => ({
            ...prev,
            role,
            isAdmin: role === 'admin',
          }));
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserRole]);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { 
            name: name || 'User',
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        return { data, error };
      }

      // If signup is successful and we have a session, the trigger should create the profile
      // But we'll also manually ensure it's created if needed
      if (data.user && data.session) {
        // Give it a moment for the trigger to run
        setTimeout(async () => {
          try {
            // Verify profile was created
            const { data: profile } = await supabase
              .from('profiles')
              .select('id')
              .eq('id', data.user.id)
              .single();

            if (!profile) {
              // Create profile manually if trigger didn't work
              await supabase
                .from('profiles')
                .insert({
                  id: data.user.id,
                  name: name || 'User',
                  email: email,
                });

              // Create user role
              await supabase
                .from('user_roles')
                .insert({
                  user_id: data.user.id,
                  role: 'user',
                });
            }
          } catch (err) {
            console.error('Error creating profile/role:', err);
          }
        }, 1000);
      }

      return { data, error };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Sign up failed');
      console.error('Sign up exception:', err);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        return { data, error };
      }

      // Ensure profile exists after sign in (in case it wasn't created during signup)
      if (data.user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', data.user.id)
            .single();

          if (!profile) {
            // Create profile if it doesn't exist
            await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
                email: data.user.email || email,
              });

            // Create user role if it doesn't exist
            await supabase
              .from('user_roles')
              .insert({
                user_id: data.user.id,
                role: 'user',
              });
          }
        } catch (profileError) {
          console.warn('Profile check/creation error (non-critical):', profileError);
        }

        // Refresh role after sign in
        const role = await fetchUserRole(data.user.id);
        setAuthState(prev => ({
          ...prev,
          role,
          isAdmin: role === 'admin',
        }));
      }

      return { data, error };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Sign in failed');
      console.error('Sign in exception:', err);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
  };
}
