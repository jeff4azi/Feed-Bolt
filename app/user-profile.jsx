import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, Pressable, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import PostCard from './components/PostCard';

export default function UserProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userId } = useLocalSearchParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  const fetchData = useCallback(async () => {
    const [{ data: profileData }, { data: postsData }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('posts').select('*, profiles(id, fullname, username, avatar_url), comments(count)')
        .eq('user_id', userId).order('created_at', { ascending: false }),
    ]);
    if (profileData) setProfile(profileData);
    if (postsData) setPosts(postsData);
  }, [userId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (!profile) {
    return (
      <View className="flex-1 bg-[#0B0B0F] items-center justify-center" style={{ paddingTop: insets.top }}>
        <Text className="text-gray-500">Loading...</Text>
      </View>
    );
  }

  const displayName = profile.fullname ?? 'Unknown';
  const username = profile.username ?? '';
  const avatar = profile.avatar_url;

  return (
    <View className="flex-1 bg-[#0B0B0F]" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0B0F" />

      <View className="flex-row items-center px-4 py-3">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={22} color="white" />
        </Pressable>
        <Text className="text-white text-lg font-semibold">{username ? `@${username}` : displayName}</Text>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
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
              {profile.bio ? <Text className="text-gray-400 text-sm text-center mt-3 leading-5">{profile.bio}</Text> : null}

              <View className="flex-row gap-8 mt-6">
                <View className="items-center">
                  <Text className="text-white font-bold text-lg">{posts.length}</Text>
                  <Text className="text-gray-500 text-xs">Posts</Text>
                </View>
              </View>

              <Pressable className="mt-5 px-10 py-2.5 bg-purple-600 rounded-full">
                <Text className="text-white text-sm font-semibold">Follow</Text>
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
