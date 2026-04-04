import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, StatusBar, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockUser } from './data/mockData';

export default function CreatePostScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [content, setContent] = useState('');

  const handlePost = () => {
    if (content.trim().length === 0) return;
    // Mock post submission
    router.back();
  };

  return (
    <View className="flex-1 bg-[#0B0B0F]" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0B0F" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-800">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="white" />
          </Pressable>
          <Text className="text-white font-semibold text-base">New Post</Text>
          <Pressable
            onPress={handlePost}
            className={`px-5 py-2 rounded-full ${content.trim().length > 0 ? 'bg-purple-600' : 'bg-gray-800'}`}
          >
            <Text
              className={`font-semibold text-sm ${content.trim().length > 0 ? 'text-white' : 'text-gray-600'}`}
            >
              Post
            </Text>
          </Pressable>
        </View>

        {/* Input area */}
        <View className="flex-1 flex-row px-4 pt-5">
          <Image
            source={{ uri: mockUser.avatar }}
            className="w-10 h-10 rounded-full mt-1"
          />
          <View className="flex-1 ml-3">
            <Text className="text-white font-semibold text-sm mb-2">
              {mockUser.username}
            </Text>
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="What's on your mind?"
              placeholderTextColor="#4b5563"
              multiline
              autoFocus
              maxLength={280}
              className="text-gray-200 text-base leading-6 flex-1"
              style={{ textAlignVertical: 'top' }}
            />
          </View>
        </View>

        {/* Footer */}
        <View className="flex-row items-center justify-between px-4 py-3 border-t border-gray-800">
          <View className="flex-row gap-4">
            <Pressable>
              <Ionicons name="image-outline" size={22} color="#6b7280" />
            </Pressable>
            <Pressable>
              <Ionicons name="at-outline" size={22} color="#6b7280" />
            </Pressable>
            <Pressable>
              <Ionicons name="happy-outline" size={22} color="#6b7280" />
            </Pressable>
          </View>
          <Text className={`text-xs ${content.length > 250 ? 'text-red-400' : 'text-gray-600'}`}>
            {280 - content.length}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
