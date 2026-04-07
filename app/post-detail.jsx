import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, StatusBar, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import CommentItem from './components/CommentItem';

export default function PostDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { postId } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const fetchLikes = useCallback(async () => {
    const { data, count } = await supabase
      .from('likes')
      .select('user_id', { count: 'exact' })
      .eq('post_id', postId);
    setLikeCount(count ?? 0);
    setLiked(data?.some((l) => l.user_id === user?.id) ?? false);
  }, [postId, user]);

  const handleLike = async () => {
    if (!user) return;
    if (liked) {
      setLiked(false);
      setLikeCount((c) => c - 1);
      await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', user.id);
    } else {
      setLiked(true);
      setLikeCount((c) => c + 1);
      await supabase.from('likes').insert({ post_id: postId, user_id: user.id });
    }
  };

  const fetchPost = useCallback(async () => {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(id, fullname, username, avatar_url)')
      .eq('id', postId)
      .single();
    if (data) setPost(data);
  }, [postId]);

  const fetchComments = useCallback(async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(id, fullname, username, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    if (data) setComments(data);
  }, [postId]);

  useEffect(() => {
    fetchPost();
    fetchComments();
    fetchLikes();
  }, [fetchPost, fetchComments, fetchLikes]);

  const handleAddComment = async () => {
    if (commentText.trim().length === 0) return;
    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      user_id: user.id,
      content: commentText.trim(),
    });
    if (!error) {
      setCommentText('');
      Keyboard.dismiss();
      fetchComments();
    }
  };

  const profile = post?.profiles;
  const avatar = profile?.avatar_url;
  const username = profile?.username ?? profile?.fullname ?? 'Unknown';
  const imageUri = post?.public_url ?? post?.image_url;
  const userAvatar = user?.user_metadata?.avatar_url;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#0B0B0F', paddingTop: insets.top }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={0}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0B0B0F" />

      <View className="flex-row items-center px-4 py-3 border-b border-gray-800">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={22} color="white" />
        </Pressable>
        <Text className="text-white text-lg font-semibold">Post</Text>
      </View>

      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CommentItem comment={item} />}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        ListHeaderComponent={
          post ? (
            <View>
              <View className="bg-[#121218] rounded-2xl p-4 my-4">
                <View className="flex-row items-center mb-3">
                  <Pressable onPress={() => profile?.id && router.push({ pathname: '/user-profile', params: { userId: profile.id } })}>
                    {avatar ? (
                      <Image source={{ uri: avatar }} className="w-11 h-11 rounded-full" />
                    ) : (
                      <View className="w-11 h-11 rounded-full bg-[#1a1a2e] items-center justify-center">
                        <Ionicons name="person" size={22} color="#a855f7" />
                      </View>
                    )}
                  </Pressable>
                  <View className="ml-3">
                    <Text className="text-white font-semibold">{username}</Text>
                    <Text className="text-gray-500 text-xs">{new Date(post.created_at).toLocaleDateString()}</Text>
                  </View>
                </View>
                <Text className="text-gray-200 text-base leading-6 mb-4">{post.content}</Text>
                {imageUri && (
                  <Image source={{ uri: imageUri }} style={{ width: '100%', aspectRatio: 16 / 9, borderRadius: 12, marginBottom: 16 }} resizeMode="cover" />
                )}
                <View className="flex-row items-center gap-5 pt-3 border-t border-gray-800">
                  <Pressable onPress={handleLike} className="flex-row items-center gap-1.5">
                    <Ionicons name={liked ? 'heart' : 'heart-outline'} size={22} color={liked ? '#a855f7' : '#6b7280'} />
                    <Text className="text-gray-400 text-sm">{likeCount}</Text>
                  </Pressable>
                  <View className="flex-row items-center gap-1.5">
                    <Ionicons name="chatbubble-outline" size={20} color="#6b7280" />
                    <Text className="text-gray-400 text-sm">{comments.length}</Text>
                  </View>
                </View>
              </View>
              <Text className="text-gray-500 text-xs uppercase tracking-widest mb-4">Comments</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <Text className="text-gray-600 text-center py-6">No comments yet. Be the first!</Text>
        }
      />

      <View
        className="flex-row items-center px-4 py-3 border-t border-gray-800 bg-[#0B0B0F]"
        style={{ paddingBottom: insets.bottom || 12 }}
      >
        {userAvatar ? (
          <Image source={{ uri: userAvatar }} className="w-8 h-8 rounded-full mr-3" />
        ) : (
          <View className="w-8 h-8 rounded-full bg-[#1a1a2e] items-center justify-center mr-3">
            <Ionicons name="person" size={16} color="#a855f7" />
          </View>
        )}
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
          <Ionicons name="send" size={20} color={commentText.trim().length > 0 ? '#a855f7' : '#374151'} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
