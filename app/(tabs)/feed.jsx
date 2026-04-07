import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, FlatList, Image, Pressable, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import PostCard from '../components/PostCard';
import { PostCardSkeleton } from '../components/Skeleton';

export default function FeedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const spinAnim = useRef(new Animated.Value(0)).current;
  const spinLoop = useRef(null);

  const fetchPosts = useCallback(async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(id, fullname, username, avatar_url), comments(count)')
      .order('created_at', { ascending: false });
    if (!error) setPosts(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  useEffect(() => {
    if (refreshing) {
      spinLoop.current = Animated.loop(
        Animated.timing(spinAnim, { toValue: 1, duration: 700, easing: Easing.linear, useNativeDriver: true })
      );
      spinLoop.current.start();
    } else {
      spinLoop.current?.stop();
      spinAnim.setValue(0);
    }
  }, [refreshing]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const avatar = user?.user_metadata?.avatar_url;

  return (
    <View className="flex-1 bg-[#0B0B0F]" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0B0F" />

      <View className="flex-row items-center justify-between px-4 py-3">
        <Text className="text-white text-2xl font-bold">
          Feed<Text className="text-purple-400">Bolt</Text>
        </Text>
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => router.push('/create-post')}
            className="w-9 h-9 bg-[#121218] rounded-full items-center justify-center border border-gray-800"
          >
            <Ionicons name="add" size={20} color="#a855f7" />
          </Pressable>
          <Pressable onPress={() => router.push('/(tabs)/profile')}>
            {avatar ? (
              <Image source={{ uri: avatar }} className="w-9 h-9 rounded-full border border-purple-700" />
            ) : (
              <View className="w-9 h-9 rounded-full border border-purple-700 bg-[#1a1a2e] items-center justify-center">
                <Ionicons name="person" size={18} color="#a855f7" />
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <FlatList
        data={loading ? [] : posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} currentUserId={user?.id} onRefresh={fetchPosts} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        ListHeaderComponent={
          <View>
            {refreshing && (
              <View style={{ alignItems: 'center', paddingVertical: 12 }}>
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <Ionicons name="reload" size={22} color="#a855f7" />
                </Animated.View>
              </View>
            )}
            <View className="px-4 mb-4">
              <Text className="text-gray-500 text-xs uppercase tracking-widest">Latest Posts</Text>
            </View>
            {loading && [1, 2, 3].map((i) => <PostCardSkeleton key={i} />)}
          </View>
        }
        ListEmptyComponent={
          !loading && <Text className="text-gray-600 text-center mt-12">No posts yet. Be the first!</Text>
        }
      />
    </View>
  );
}
