import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import type { ProfileRow, UserType } from "@/types/supabase";

type AuthResult = { error: boolean; message?: string };

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: ProfileRow | null;
  userType: UserType;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, userType: 'guest' | 'host', fullName?: string) => Promise<AuthResult & { needsConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  updateProfile: (changes: Partial<Pick<ProfileRow, 'full_name' | 'avatar_url'>>) => Promise<AuthResult>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!active) return;
      if (error) {
        console.error(error);
        toast({
          title: "Error fetching session",
          description: error.message,
          variant: "destructive",
        });
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  const { data: profile = null } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .maybeSingle();
      if (error) throw error;
      return (data as ProfileRow | null) ?? null;
    },
    enabled: !!user,
  });

  const userType: UserType =
    profile?.user_type ?? (user?.user_metadata?.user_type as UserType | undefined) ?? 'guest';

  const ensureProfile = useCallback(async (u: User, type: 'guest' | 'host', fullName?: string) => {
    const { data: existing } = await supabase.from('profiles').select('id').eq('id', u.id).maybeSingle();
    if (existing) return null;
    const { error } = await supabase.from('profiles').insert({
      id: u.id,
      full_name: fullName || null,
      user_type: type,
    });
    return error;
  }, []);

  const signUp: AuthContextType['signUp'] = async (email, password, type, fullName) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: type,
            full_name: fullName || null,
          }
        }
      });

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        return { error: true, message: error.message };
      }

      // With email confirmation turned on, Supabase returns no session yet. The
      // profile row is then created by the database trigger in supabase/schema.sql.
      if (data.user && data.session) {
        const profileError = await ensureProfile(data.user, type, fullName);
        if (profileError) {
          console.error("Failed to create profile:", profileError);
        }
        queryClient.invalidateQueries({ queryKey: ['profile', data.user.id] });
      }

      const needsConfirmation = !data.session;
      toast({
        title: needsConfirmation ? "Check your email" : "Welcome to PoolPass",
        description: needsConfirmation
          ? "We've sent you a link to confirm your account."
          : "Your account is ready.",
      });

      return { error: false, needsConfirmation };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Sign up failed",
        description: message,
        variant: "destructive",
      });
      return { error: true, message };
    }
  };

  const signIn: AuthContextType['signIn'] = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const message = error.message === 'Invalid login credentials'
          ? 'That email and password combination is not recognised.'
          : error.message;
        toast({
          title: "Sign in failed",
          description: message,
          variant: "destructive",
        });
        return { error: true, message };
      }

      if (data.user) {
        const type = (data.user.user_metadata?.user_type as 'guest' | 'host' | undefined) ?? 'guest';
        await ensureProfile(data.user, type, data.user.user_metadata?.full_name as string | undefined);
      }

      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
      return { error: false };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Sign in failed",
        description: message,
        variant: "destructive",
      });
      return { error: true, message };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      queryClient.removeQueries({ queryKey: ['profile'] });
      queryClient.removeQueries({ queryKey: ['bookings'] });
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const updateProfile: AuthContextType['updateProfile'] = async (changes) => {
    if (!user) return { error: true, message: 'Not signed in' };
    const { error } = await supabase.from('profiles').update(changes).eq('id', user.id);
    if (error) return { error: true, message: error.message };
    queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
    return { error: false };
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, userType, signIn, signUp, signOut, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

