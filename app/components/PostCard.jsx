import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

function PostImage({ uri }) {
  const [height, setHeight] = useState(200);

  return (
    <View
      className="w-full rounded-xl mb-4 overflow-hidden"
      onLayout={(e) => {
        const containerWidth = e.nativeEvent.layout.width;
        Image.getSize(uri, (w, h) => {
          setHeight((h / w) * containerWidth);
        });
      }}
    >
      <Image
        source={{ uri }}
        style={{ width: '100%', height }}
        resizeMode="cover"
      />
    </View>
  );
}

export default function PostCard({ post }) {
  const router = useRouter();
  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/post-detail', params: { postId: post.id } })}
      className="bg-[#121218] rounded-2xl p-4 mb-3 mx-4"
    >
      {/* Header */}
      <View className="flex-row items-center mb-3">
        <Pressable onPress={() => router.push({ pathname: '/user-profile', params: { userId: post.userId } })}>
          <Image
            source={{ uri: post.avatar }}
            className="w-10 h-10 rounded-full"
          />
        </Pressable>
        <View className="ml-3 flex-1">
          <Text className="text-white font-semibold text-sm">{post.username}</Text>
          <Text className="text-gray-500 text-xs">{post.timestamp}</Text>
        </View>
      </View>

      {/* Content */}
      <Text className="text-gray-200 text-sm leading-5 mb-4">{post.content}</Text>

      {/* Post image */}
      {post.image && <PostImage uri={post.image} />}

      {/* Actions */}
      <View className="flex-row items-center gap-5">
        <Pressable onPress={handleLike} className="flex-row items-center gap-1.5">
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={20}
            color={liked ? '#a855f7' : '#6b7280'}
          />
          <Text className="text-gray-400 text-xs">{likeCount}</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push({ pathname: '/post-detail', params: { postId: post.id } })}
          className="flex-row items-center gap-1.5"
        >
          <Ionicons name="chatbubble-outline" size={18} color="#6b7280" />
          <Text className="text-gray-400 text-xs">{post.comments}</Text>
        </Pressable>

        <Pressable className="flex-row items-center gap-1.5">
          <Ionicons name="share-social-outline" size={18} color="#6b7280" />
        </Pressable>
      </View>
    </Pressable>
  );
}
