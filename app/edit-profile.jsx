import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
      if (data) {
        setDisplayName(data.fullname ?? '');
        setUsername(data.username ?? '');
        setBio(data.bio ?? '');
        setAvatar(data.avatar_url ?? user?.user_metadata?.avatar_url ?? null);
      }
    });
  }, [user]);

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert('Validation', 'Display name cannot be empty.');
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from('profiles').update({
        fullname: displayName.trim(),
        username: username.trim(),
        bio: bio.trim(),
      }).eq('id', user.id);
      if (error) throw error;
      router.back();
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setSaving(false);
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
          <Text className="text-white font-semibold text-base">Edit Profile</Text>
          <Pressable onPress={handleSave} disabled={saving}>
            <Text className={`font-semibold text-sm ${saving ? 'text-gray-600' : 'text-purple-400'}`}>
              {saving ? 'Saving...' : 'Save'}
            </Text>
          </Pressable>
        </View>

        <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
          <View className="items-center py-6">
            {avatar ? (
              <Image source={{ uri: avatar }} className="w-24 h-24 rounded-full border-2 border-purple-600" />
            ) : (
              <View className="w-24 h-24 rounded-full border-2 border-purple-600 bg-[#1a1a2e] items-center justify-center">
                <Ionicons name="person" size={40} color="#a855f7" />
              </View>
            )}
            <Pressable className="mt-2">
              <Text className="text-purple-400 text-sm">Change photo</Text>
            </Pressable>
          </View>

          <View className="px-4 gap-5">
            <Field label="Display Name" value={displayName} onChangeText={setDisplayName} placeholder="Your name" />
            <Field label="Username" value={username} onChangeText={setUsername} placeholder="@username" autoCapitalize="none" />
            <Field
              label="Bio"
              value={bio}
              onChangeText={setBio}
              placeholder="Tell people about yourself..."
              multiline
              maxLength={160}
              inputStyle={{ minHeight: 80, textAlignVertical: 'top' }}
            />
            <Text className="text-gray-600 text-xs text-right -mt-3">{bio.length}/160</Text>

            <View>
              <Text className="text-gray-500 text-xs mb-1.5 uppercase tracking-wider">Email</Text>
              <View className="bg-[#1a1a2e] rounded-xl px-4 py-3">
                <Text className="text-gray-500 text-sm">{user?.email ?? '—'}</Text>
              </View>
              <Text className="text-gray-600 text-xs mt-1">Email cannot be changed here.</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function Field({ label, inputStyle, ...props }) {
  return (
    <View>
      <Text className="text-gray-500 text-xs mb-1.5 uppercase tracking-wider">{label}</Text>
      <TextInput
        className="bg-[#121218] text-gray-200 rounded-xl px-4 py-3 text-sm border border-gray-800"
        placeholderTextColor="#4b5563"
        style={inputStyle}
        {...props}
      />
    </View>
  );
}
