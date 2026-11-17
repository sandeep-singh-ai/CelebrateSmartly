
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useBrevoService } from '@/hooks/useBrevoService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<{ error?: any }>;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<{ error?: any }>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { sendRegistrationEmail } = useBrevoService();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) return { error };

      // Send registration email if user was created successfully
      if (data.user && !error) {
        try {
          const userName = userData.first_name || userData.name || email.split('@')[0];
          console.log('Attempting to send registration email to:', email);
          const emailResult = await sendRegistrationEmail(userName, email);
          console.log('Registration email result:', emailResult);
        } catch (emailError) {
          console.error('Registration email failed (non-blocking):', emailError);
          // Don't fail the signup if email fails
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔄 AuthContext: Starting sign in process...');
    console.log('🔄 AuthContext: Email:', email, 'Password length:', password.length);
    setLoading(true);
    try {
      console.log('🔄 AuthContext: Calling Supabase auth.signInWithPassword...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('🔄 AuthContext: Supabase response received');
      console.log('🔄 AuthContext: Data:', data);
      console.log('🔄 AuthContext: Error:', error);
      
      if (error) {
        console.log('❌ AuthContext: Supabase sign in error:', error);
        console.log('❌ AuthContext: Error message:', error.message);
        console.log('❌ AuthContext: Error status:', error.status);
        return { error };
      }
      
      console.log('✅ AuthContext: Sign in successful, user:', data.user?.email);
      return { error: null };
    } catch (error) {
      console.error('💥 AuthContext: Unexpected error during sign in:', error);
      return { error };
    } finally {
      setLoading(false);
      console.log('🔄 AuthContext: Sign in loading state cleared');
    }
  };

  const signOut = async () => {
    console.log('🔄 AuthContext: Starting sign out process...');
    setLoading(true);
    try {
      console.log('🔄 AuthContext: Calling Supabase auth.signOut()...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ AuthContext: Supabase sign out error:', error);
        return { error };
      }
      
      console.log('✅ AuthContext: Supabase sign out successful, clearing local state...');
      // Clear local state
      setUser(null);
      setSession(null);
      
      console.log('✅ AuthContext: Sign out complete, local state cleared');
      return { error: null };
    } catch (error) {
      console.error('💥 AuthContext: Unexpected error during sign out:', error);
      return { error };
    } finally {
      setLoading(false);
      console.log('🔄 AuthContext: Sign out loading state cleared');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
