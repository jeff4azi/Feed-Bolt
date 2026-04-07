import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle deep link callback on native (Android/iOS)
  useEffect(() => {
    if (Platform.OS === 'web') return;

    const handleUrl = async ({ url }) => {
      if (!url) return;
      // Extract tokens from the URL fragment
      const parsed = Linking.parse(url);
      const params = parsed.queryParams ?? {};

      // Supabase puts tokens in the hash fragment as query-like params
      const hashString = url.split('#')[1] ?? '';
      const hashParams = Object.fromEntries(new URLSearchParams(hashString));

      const accessToken = hashParams.access_token ?? params.access_token;
      const refreshToken = hashParams.refresh_token ?? params.refresh_token;

      if (accessToken && refreshToken) {
        await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
      }
    };

    const sub = Linking.addEventListener('url', handleUrl);

    // Handle the case where the app was opened via deep link while closed
    Linking.getInitialURL().then((url) => { if (url) handleUrl({ url }); });

    return () => sub.remove();
  }, []);

  const signInWithGoogle = async () => {
    if (Platform.OS === 'web') {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: process.env.EXPO_PUBLIC_SUPABASE_REDIRECT_URL },
      });
      if (error) throw error;
      return;
    }

    // Native: use expo-web-browser to open the OAuth URL and handle redirect
    const redirectTo = Linking.createURL('/');

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });
    if (error) throw error;

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

    if (result.type === 'success' && result.url) {
      const hashString = result.url.split('#')[1] ?? '';
      const hashParams = Object.fromEntries(new URLSearchParams(hashString));
      const parsed = Linking.parse(result.url);
      const queryParams = parsed.queryParams ?? {};

      const accessToken = hashParams.access_token ?? queryParams.access_token;
      const refreshToken = hashParams.refresh_token ?? queryParams.refresh_token;

      if (accessToken && refreshToken) {
        await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
      }
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
