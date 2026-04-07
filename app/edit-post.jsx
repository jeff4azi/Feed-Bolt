import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';

export default function EditPostScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { postId, content: initialContent } = useLocalSearchParams();
  const [content, setContent] = useState(initialContent ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!content.trim() || saving) return;
    setSaving(true);
    const { error } = await supabase.from('posts').update({ content: content.trim() }).eq('id', postId);
    if (error) {
      Alert.alert('Error', error.message);
      setSaving(false);
    } else {
      router.back();
    }
  };

  return (
    <View className="flex-1 bg-[#0B0B0F]" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0B0F" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">

        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-800">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="white" />
          </Pressable>
          <Text className="text-white font-semibold text-base">Edit Post</Text>
          <Pressable
            onPress={handleSave}
            disabled={saving || !content.trim()}
            className={`px-5 py-2 rounded-full ${content.trim() && !saving ? 'bg-purple-600' : 'bg-gray-800'}`}
          >
            <Text className={`font-semibold text-sm ${content.trim() && !saving ? 'text-white' : 'text-gray-600'}`}>
              {saving ? 'Saving...' : 'Save'}
            </Text>
          </Pressable>
        </View>

        <ScrollView className="flex-1 px-4 pt-5" keyboardShouldPersistTaps="handled">
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="What's on your mind?"
            placeholderTextColor="#4b5563"
            multiline
            autoFocus
            maxLength={280}
            className="text-gray-200 text-base leading-6"
            style={{ textAlignVertical: 'top', minHeight: 120 }}
          />
          <Text className={`text-xs mt-2 text-right ${content.length > 250 ? 'text-red-400' : 'text-gray-600'}`}>
            {280 - content.length}
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
