import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, Image, Pressable, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PostCard from './components/PostCard';
import { mockPosts } from './data/mockData';

// Mock data for other users
const otherUsers = {
  u2: { displayName: 'Sara UI', username: 'sara_ui', avatar: 'https://i.pravatar.cc/150?img=5', bio: 'UI/UX designer & React Native dev 🎨', followers: 3820, following: 210 },
  u3: { displayName: 'Jay Codes', username: 'code_with_jay', avatar: 'https://i.pravatar.cc/150?img=8', bio: 'TypeScript evangelist. Open source contributor 💻', followers: 9100, following: 540 },
  u4: { displayName: 'Mia Builds', username: 'mia.builds', avatar: 'https://i.pravatar.cc/150?img=9', bio: 'Mobile-first everything. Expo fan 📱', followers: 5430, following: 320 },
  u5: { displayName: 'Tom Dev', username: 'devtom_', avatar: 'https://i.pravatar.cc/150?img=12', bio: 'Ship fast, learn faster 🚀', followers: 14200, following: 890 },
};

export default function UserProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userId } = useLocalSearchParams();

  const user = otherUsers[userId];
  const userPosts = mockPosts.filter((p) => p.userId === userId);

  if (!user) {
    return (
      <View className="flex-1 bg-[#0B0B0F] items-center justify-center" style={{ paddingTop: insets.top }}>
        <Text className="text-gray-500">User not found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0B0B0F]" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0B0F" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={22} color="white" />
        </Pressable>
        <Text className="text-white text-lg font-semibold">@{user.username}</Text>
      </View>

      <FlatList
        data={userPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListHeaderComponent={
          <View>
            {/* Profile info */}
            <View className="items-center px-4 py-6">
              <Image
                source={{ uri: user.avatar }}
                className="w-24 h-24 rounded-full border-2 border-purple-600"
              />
              <Text className="text-white text-xl font-bold mt-4">{user.displayName}</Text>
              <Text className="text-purple-400 text-sm mt-1">@{user.username}</Text>
              <Text className="text-gray-400 text-sm text-center mt-3 leading-5">{user.bio}</Text>

              {/* Stats */}
              <View className="flex-row gap-8 mt-6">
                <View className="items-center">
                  <Text className="text-white font-bold text-lg">{userPosts.length}</Text>
                  <Text className="text-gray-500 text-xs">Posts</Text>
                </View>
                <View className="items-center">
                  <Text className="text-white font-bold text-lg">{user.followers.toLocaleString()}</Text>
                  <Text className="text-gray-500 text-xs">Followers</Text>
                </View>
                <View className="items-center">
                  <Text className="text-white font-bold text-lg">{user.following}</Text>
                  <Text className="text-gray-500 text-xs">Following</Text>
                </View>
              </View>

              {/* Follow button */}
              <Pressable className="mt-5 px-10 py-2.5 bg-purple-600 rounded-full">
                <Text className="text-white text-sm font-semibold">Follow</Text>
              </Pressable>
            </View>

            <View className="border-t border-gray-800 mx-4 mb-4" />
            <Text className="text-gray-500 text-xs uppercase tracking-widest px-4 mb-3">Posts</Text>
          </View>
        }
        ListEmptyComponent={
          <Text className="text-gray-600 text-center mt-8">No posts yet.</Text>
        }
      />
    </View>
  );
}
