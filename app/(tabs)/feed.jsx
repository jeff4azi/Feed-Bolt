import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Image, Pressable, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockPosts, mockUser } from '../../data/mockData';
import PostCard from '../components/PostCard';

export default function FeedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#0B0B0F]" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0B0F" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text className="text-white text-2xl font-bold">
          Feed<Text className="text-purple-400">Bolt</Text>
        </Text>
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => router.push('/create-post')}
            className="w-9 h-9 bg-[#121218] rounded-full items-center justify-center border border-gray-800"
          >
            <Ionicons name="add" size={20} color="#a855f7" />
          </Pressable>
          <Pressable onPress={() => router.push('/(tabs)/profile')}>
            <Image
              source={{ uri: mockUser.avatar }}
              className="w-9 h-9 rounded-full border border-purple-700"
            />
          </Pressable>
        </View>
      </View>

      {/* Feed */}
      <FlatList
        data={mockPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
        ListHeaderComponent={
          <View className="px-4 mb-4">
            <Text className="text-gray-500 text-xs uppercase tracking-widest">Latest Posts</Text>
          </View>
        }
      />
    </View>
  );
}
