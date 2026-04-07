import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

function PostImage({ uri }) {
  const [height, setHeight] = useState(200);

  const MAX_HEIGHT = 700;

  return (
    <View
      className="w-full rounded-xl mb-4 overflow-hidden"
      onLayout={(e) => {
        const containerWidth = e.nativeEvent.layout.width;
        Image.getSize(uri, (w, h) => {
          const natural = (h / w) * containerWidth;
          setHeight(Math.min(natural, MAX_HEIGHT));
        });
      }}
    >
      <Image source={{ uri }} style={{ width: '100%', height }} resizeMode="cover" />
    </View>
  );
}

export default function PostCard({ post, currentUserId, onRefresh }) {
  const router = useRouter();
  const { user } = useAuth();
  const profile = post.profiles;
  const avatar = profile?.avatar_url;
  const username = profile?.username ?? profile?.fullname ?? 'Unknown';
  const timestamp = new Date(post.created_at).toLocaleDateString();
  const imageUri = post.public_url ?? post.image_url;
  const commentCount = post.comments?.[0]?.count ?? 0;

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    // fetch like count and whether current user liked this post
    supabase
      .from('likes')
      .select('user_id', { count: 'exact' })
      .eq('post_id', post.id)
      .then(({ data, count }) => {
        setLikeCount(count ?? 0);
        setLiked(data?.some((l) => l.user_id === user.id) ?? false);
      });
  }, [post.id, user]);

  const handleLike = async () => {
    if (!user) return;
    if (liked) {
      setLiked(false);
      setLikeCount((c) => c - 1);
      await supabase.from('likes').delete().eq('post_id', post.id).eq('user_id', user.id);
    } else {
      setLiked(true);
      setLikeCount((c) => c + 1);
      await supabase.from('likes').insert({ post_id: post.id, user_id: user.id });
    }
  };

  const handleAvatarPress = () => {
    if (!profile?.id) return;
    if (profile.id === currentUserId) {
      router.push('/(tabs)/profile');
    } else {
      router.push({ pathname: '/user-profile', params: { userId: profile.id } });
    }
  };

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/post-detail', params: { postId: post.id } })}
      className="bg-[#121218] rounded-2xl p-4 mb-3 mx-4"
    >
      <View className="flex-row items-center mb-3">
        <Pressable onPress={handleAvatarPress}>
          {avatar ? (
            <Image source={{ uri: avatar }} className="w-10 h-10 rounded-full" />
          ) : (
            <View className="w-10 h-10 rounded-full bg-[#1a1a2e] items-center justify-center">
              <Ionicons name="person" size={20} color="#a855f7" />
            </View>
          )}
        </Pressable>
        <View className="ml-3 flex-1">
          <Text className="text-white font-semibold text-sm">{username}</Text>
          <Text className="text-gray-500 text-xs">{timestamp}</Text>
        </View>
      </View>

      <Text className="text-gray-200 text-sm leading-5 mb-4">{post.content}</Text>

      {imageUri && <PostImage uri={imageUri} />}

      <View className="flex-row items-center gap-5">
        <Pressable onPress={handleLike} className="flex-row items-center gap-1.5">
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={20} color={liked ? '#a855f7' : '#6b7280'} />
          <Text className="text-gray-400 text-xs">{likeCount}</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push({ pathname: '/post-detail', params: { postId: post.id } })}
          className="flex-row items-center gap-1.5"
        >
          <Ionicons name="chatbubble-outline" size={18} color="#6b7280" />
          <Text className="text-gray-400 text-xs">{commentCount}</Text>
        </Pressable>
        <Pressable className="flex-row items-center gap-1.5">
          <Ionicons name="share-social-outline" size={18} color="#6b7280" />
        </Pressable>
      </View>
    </Pressable>
  );
}
