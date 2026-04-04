import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AuthScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleContinue = () => {
    router.replace('/(tabs)/feed');
  };

  return (
    <View className="flex-1 bg-[#0B0B0F]" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0B0F" />

      {/* Top decorative blobs */}
      <View className="absolute top-0 left-0 right-0 items-center">
        <View
          className="w-72 h-72 rounded-full opacity-20"
          style={{ backgroundColor: '#7c3aed', transform: [{ translateY: -80 }], filter: 'blur(60px)' }}
        />
      </View>

      <View className="flex-1 justify-center items-center px-8">
        {/* Logo area */}
        <View className="items-center mb-16">
          <View className="w-20 h-20 rounded-2xl bg-[#121218] items-center justify-center mb-6 border border-purple-900">
            <Text className="text-4xl">⚡</Text>
          </View>
          <Text className="text-white text-5xl font-bold tracking-tight">FeedBolt</Text>
          <Text className="text-gray-500 text-base mt-3 text-center">
            Your feed, supercharged.
          </Text>
        </View>

        {/* Auth buttons */}
        <View className="w-full gap-3">
          <Pressable
            onPress={handleContinue}
            className="flex-row items-center justify-center bg-white rounded-2xl py-4 gap-3"
          >
            <Ionicons name="logo-google" size={20} color="#0B0B0F" />
            <Text className="text-[#0B0B0F] font-semibold text-base">
              Continue with Google
            </Text>
          </Pressable>

          <Pressable
            onPress={handleContinue}
            className="flex-row items-center justify-center bg-[#121218] border border-gray-800 rounded-2xl py-4 gap-3"
          >
            <Ionicons name="logo-apple" size={22} color="white" />
            <Text className="text-white font-semibold text-base">
              Continue with Apple
            </Text>
          </Pressable>
        </View>

        <Text className="text-gray-600 text-xs text-center mt-8 leading-5">
          By continuing, you agree to our{' '}
          <Text className="text-purple-400">Terms of Service</Text>
          {' '}and{' '}
          <Text className="text-purple-400">Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
}
