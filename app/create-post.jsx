import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { pickImage, uploadImage } from '../lib/imageUtils';
import { supabase } from '../lib/supabase';

export default function CreatePostScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { width: screenWidth } = useWindowDimensions();
  const [content, setContent] = useState('');
  const [pickedAsset, setPickedAsset] = useState(null); // { uri, ratio, base64, mimeType, fileName }
  const [posting, setPosting] = useState(false);

  const imageWidth = screenWidth - 32 - 40 - 12;

  const handlePickImage = async () => {
    try {
      const asset = await pickImage();
      if (asset) setPickedAsset(asset);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handlePost = async () => {
    if (content.trim().length === 0 || posting) return;
    setPosting(true);
    try {
      let image_url = null;
      let image_public_id = null;

      if (pickedAsset) {
        const uploaded = await uploadImage(pickedAsset);
        image_url = uploaded.image_url;
        image_public_id = uploaded.image_public_id;
      }

      const { error } = await supabase.from('posts').insert({
        user_id: user.id,
        content: content.trim(),
        image_url,
        image_public_id,
      });
      if (error) throw error;
      router.back();
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setPosting(false);
    }
  };

  const avatar = user?.user_metadata?.avatar_url;
  const username = user?.user_metadata?.full_name ?? user?.email ?? 'You';

  return (
    <View className="flex-1 bg-[#0B0B0F]" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0B0F" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
        className="flex-1"
      >

        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-800">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="white" />
          </Pressable>
          <Text className="text-white font-semibold text-base">New Post</Text>
          <Pressable
            onPress={handlePost}
            disabled={posting}
            className={`px-5 py-2 rounded-full ${content.trim().length > 0 && !posting ? 'bg-purple-600' : 'bg-gray-800'}`}
          >
            <Text className={`font-semibold text-sm ${content.trim().length > 0 && !posting ? 'text-white' : 'text-gray-600'}`}>
              {posting ? 'Posting...' : 'Post'}
            </Text>
          </Pressable>
        </View>

        <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
          <View className="flex-row px-4 pt-5">
            {avatar ? (
              <Image source={{ uri: avatar }} className="w-10 h-10 rounded-full mt-1" />
            ) : (
              <View className="w-10 h-10 rounded-full bg-[#1a1a2e] items-center justify-center mt-1">
                <Ionicons name="person" size={20} color="#a855f7" />
              </View>
            )}
            <View className="flex-1 ml-3">
              <Text className="text-white font-semibold text-sm mb-2">{username}</Text>
              <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="What's on your mind?"
                placeholderTextColor="#4b5563"
                multiline
                autoFocus
                maxLength={280}
                className="text-gray-200 text-base leading-6"
                style={{ textAlignVertical: 'top', minHeight: 80 }}
              />
              {pickedAsset?.uri && (
                <View style={{ marginTop: 12 }}>
                  <Image
                    source={{ uri: pickedAsset.uri }}
                    style={{ width: imageWidth, height: imageWidth / pickedAsset.ratio, borderRadius: 12 }}
                  />
                  <Pressable
                    onPress={() => setPickedAsset(null)}
                    style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, padding: 4 }}
                  >
                    <Ionicons name="close" size={16} color="white" />
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        <View className="flex-row items-center justify-between px-4 py-3 border-t border-gray-800">
          <Pressable onPress={handlePickImage}>
            <Ionicons name="image-outline" size={22} color={pickedAsset?.uri ? '#a855f7' : '#6b7280'} />
          </Pressable>
          <Text className={`text-xs ${content.length > 250 ? 'text-red-400' : 'text-gray-600'}`}>
            {280 - content.length}
          </Text>
        </View>

      </KeyboardAvoidingView>
    </View>
  );
}
