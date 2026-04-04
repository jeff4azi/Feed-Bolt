import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const GoogleIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </Svg>
);

export default function AuthScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleGoogleSignIn = () => {
    router.replace('/(tabs)/feed');
  };

  return (
    <View className="flex-1 bg-[#0B0B0F]" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <StatusBar barStyle="light-content" />

      {/* Background Glow */}
      <View className="absolute top-[-50] left-0 right-0 items-center">
        <View
          className="w-80 h-80 rounded-full opacity-20"
          style={{ backgroundColor: '#7c3aed' }}
        />
      </View>

      <View className="flex-1 px-8 py-12 justify-between">
        {/* Top Spacer */}
        <View />

        {/* Brand/Logo Section */}
        <View className="items-center">
          <View className="bg-[#16161E] p-6 rounded-[32px] mb-8 border border-gray-800/50 shadow-2xl">
            <Image
              source={require('../assets/images/FeedBolt.png')}
              style={{ width: 80, height: 80 }}
              contentFit="contain"
            />
          </View>
          <Text className="text-white text-5xl font-bold tracking-tighter">
            FeedBolt
          </Text>
          <Text className="text-gray-400 text-lg mt-3 text-center font-medium">
            Your feed, supercharged.
          </Text>
        </View>

        {/* Action Section */}
        <View className="w-full">
          <Pressable
            onPress={handleGoogleSignIn}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }]
              }
            ]}
            className="flex-row items-center justify-center bg-white rounded-2xl h-[64px] shadow-xl"
          >
            {/* Colorful Google SVG Icon */}
            <View style={{ marginRight: 12 }}>
              <GoogleIcon />
            </View>

            <Text style={{ color: '#0B0B0F', fontWeight: 'bold', fontSize: 18 }}>
              Sign in with Google
            </Text>
          </Pressable>

          <Text className="text-gray-500 text-xs text-center mt-10 leading-5 px-6">
            By continuing, you agree to our{' '}
            <Text className="text-purple-400 font-medium">Terms of Service</Text>
            {' '}and{' '}
            <Text className="text-purple-400 font-medium">Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}