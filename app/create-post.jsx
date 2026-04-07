import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function CreatePostScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { width: screenWidth } = useWindowDimensions();
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imageRatio, setImageRatio] = useState(1);
  const [posting, setPosting] = useState(false);

  const imageWidth = screenWidth - 32 - 40 - 12;

  const handlePost = async () => {
    if (content.trim().length === 0 || posting) return;
    setPosting(true);
    try {
      let image_url = null;
      let public_url = null;

      if (image) {
        const ext = image.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${ext}`;
        const response = await fetch(image);
        const blob = await response.blob();
        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(fileName, blob, { contentType: `image/${ext}` });
        if (!uploadError) {
          image_url = fileName;
          const { data: urlData } = supabase.storage.from('post-images').getPublicUrl(fileName);
          public_url = urlData.publicUrl;
        }
      }

      const { error } = await supabase.from('posts').insert({
        user_id: user.id,
        content: content.trim(),
        image_url,
        public_url,
      });
      if (error) throw error;
      router.back();
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setPosting(false);
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      setImage(asset.uri);
      if (asset.width && asset.height) setImageRatio(asset.width / asset.height);
    }
  };

  const profile = user?.user_metadata;
  const avatar = profile?.avatar_url;
  const username = profile?.full_name ?? user?.email ?? 'You';

  return (
    <View className="flex-1 bg-[#0B0B0F]" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0B0F" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
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
              {image && (
                <View style={{ marginTop: 12 }}>
                  <Image source={{ uri: image }} style={{ width: imageWidth, height: imageWidth / imageRatio, borderRadius: 12 }} />
                  <Pressable
                    onPress={() => setImage(null)}
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
          <View className="flex-row gap-4">
            <Pressable onPress={handlePickImage}>
              <Ionicons name="image-outline" size={22} color={image ? '#a855f7' : '#6b7280'} />
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
