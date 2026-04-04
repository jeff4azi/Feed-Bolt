import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, StatusBar, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockComments, mockPosts, mockUser } from '../data/mockData';
import CommentItem from './components/CommentItem';

export default function PostDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { postId } = useLocalSearchParams();
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(
    mockComments.filter((c) => c.postId === (postId || 'p1'))
  );
  const [liked, setLiked] = useState(false);

  const post = mockPosts.find((p) => p.id === (postId || 'p1')) || mockPosts[0];

  const handleAddComment = () => {
    if (commentText.trim().length === 0) return;
    setComments([...comments, {
      id: `c${Date.now()}`,
      postId: post.id,
      username: 'alex_dev',
      avatar: 'https://i.pravatar.cc/150?img=3',
      content: commentText.trim(),
      timestamp: 'Just now',
    }]);
    setCommentText('');
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#0B0B0F', paddingTop: insets.top }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0B0B0F" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-800">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={22} color="white" />
        </Pressable>
        <Text className="text-white text-lg font-semibold">Post</Text>
      </View>

      {/* Scrollable content — flex:1 so it compresses when keyboard opens */}
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CommentItem comment={item} />}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        ListHeaderComponent={
          <View>
            <View className="bg-[#121218] rounded-2xl p-4 my-4">
              <View className="flex-row items-center mb-3">
                <Pressable onPress={() => router.push({ pathname: '/user-profile', params: { userId: post.userId } })}>
                  <Image source={{ uri: post.avatar }} className="w-11 h-11 rounded-full" />
                </Pressable>
                <View className="ml-3">
                  <Text className="text-white font-semibold">{post.username}</Text>
                  <Text className="text-gray-500 text-xs">{post.timestamp}</Text>
                </View>
              </View>
              <Text className="text-gray-200 text-base leading-6 mb-4">{post.content}</Text>
              <View className="flex-row items-center gap-5 pt-3 border-t border-gray-800">
                <Pressable onPress={() => setLiked(!liked)} className="flex-row items-center gap-1.5">
                  <Ionicons
                    name={liked ? 'heart' : 'heart-outline'}
                    size={22}
                    color={liked ? '#a855f7' : '#6b7280'}
                  />
                  <Text className="text-gray-400 text-sm">{liked ? post.likes + 1 : post.likes}</Text>
                </Pressable>
                <View className="flex-row items-center gap-1.5">
                  <Ionicons name="chatbubble-outline" size={20} color="#6b7280" />
                  <Text className="text-gray-400 text-sm">{comments.length}</Text>
                </View>
              </View>
            </View>
            <Text className="text-gray-500 text-xs uppercase tracking-widest mb-4">Comments</Text>
          </View>
        }
        ListEmptyComponent={
          <Text className="text-gray-600 text-center py-6">No comments yet. Be the first!</Text>
        }
      />

      {/* Comment input bar — sits directly inside KAV, above keyboard */}
      <View
        className="flex-row items-center px-4 py-3 border-t border-gray-800 bg-[#0B0B0F]"
        style={{ paddingBottom: insets.bottom || 12 }}
      >
        <Image
          source={{ uri: mockUser.avatar }}
          className="w-8 h-8 rounded-full mr-3"
        />
        <TextInput
          value={commentText}
          onChangeText={setCommentText}
          placeholder="Add a comment..."
          placeholderTextColor="#4b5563"
          returnKeyType="send"
          onSubmitEditing={handleAddComment}
          className="flex-1 bg-[#121218] text-gray-200 rounded-full px-4 py-2.5 text-sm"
        />
        <Pressable onPress={handleAddComment} className="ml-2">
          <Ionicons
            name="send"
            size={20}
            color={commentText.trim().length > 0 ? '#a855f7' : '#374151'}
          />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
