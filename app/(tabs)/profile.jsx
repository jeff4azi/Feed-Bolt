import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Image, Pressable, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import PostCard from '../components/PostCard';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  const fetchData = useCallback(async () => {
    if (!user) return;
    const [{ data: profileData }, { data: postsData }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('posts').select('*, profiles(id, fullname, username, avatar_url), comments(count)')
        .eq('user_id', user.id).order('created_at', { ascending: false }),
    ]);
    if (profileData) setProfile(profileData);
    if (postsData) setPosts(postsData);
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSignOut = async () => {
    const doSignOut = async () => {
      try {
        await signOut();
        router.replace('/auth');
      } catch (err) {
        Alert.alert('Error', err.message);
      }
    };
    if (typeof window !== 'undefined') {
      if (window.confirm('Are you sure you want to sign out?')) doSignOut();
    } else {
      Alert.alert('Sign out', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign out', style: 'destructive', onPress: doSignOut },
      ]);
    }
  };

  const displayName = profile?.fullname ?? user?.user_metadata?.full_name ?? user?.email ?? 'User';
  const username = profile?.username ?? user?.user_metadata?.full_name ?? '';
  const avatar = profile?.avatar_url ?? user?.user_metadata?.avatar_url;

  return (
    <View className="flex-1 bg-[#0B0B0F]" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0B0F" />

      <View className="flex-row items-center justify-between px-4 py-3">
        <Text className="text-white text-lg font-semibold">Profile</Text>
        <Pressable onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={22} color="#a855f7" />
        </Pressable>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} currentUserId={user?.id} onRefresh={fetchData} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <View>
            <View className="items-center px-4 py-6">
              {avatar ? (
                <Image source={{ uri: avatar }} className="w-24 h-24 rounded-full border-2 border-purple-600" />
              ) : (
                <View className="w-24 h-24 rounded-full border-2 border-purple-600 bg-[#1a1a2e] items-center justify-center">
                  <Ionicons name="person" size={40} color="#a855f7" />
                </View>
              )}
              <Text className="text-white text-xl font-bold mt-4">{displayName}</Text>
              {username ? <Text className="text-purple-400 text-sm mt-1">@{username}</Text> : null}
              {user?.email && <Text className="text-gray-500 text-xs mt-1">{user.email}</Text>}

              <View className="flex-row gap-8 mt-6">
                <View className="items-center">
                  <Text className="text-white font-bold text-lg">{posts.length}</Text>
                  <Text className="text-gray-500 text-xs">Posts</Text>
                </View>
              </View>

              <Pressable
                onPress={() => router.push('/edit-profile')}
                className="mt-5 px-8 py-2.5 border border-gray-700 rounded-full"
              >
                <Text className="text-gray-300 text-sm font-medium">Edit Profile</Text>
              </Pressable>
            </View>

            <View className="border-t border-gray-800 mx-4 mb-4" />
            <Text className="text-gray-500 text-xs uppercase tracking-widest px-4 mb-3">Posts</Text>
          </View>
        }
        ListEmptyComponent={
          <Text className="text-gray-600 text-center mt-8">No posts yet.</Text>
        }
      />
    </View>
  );
}
