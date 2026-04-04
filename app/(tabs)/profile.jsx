import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Image, Pressable, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PostCard from '../components/PostCard';
import { mockPosts, mockUser } from '../data/mockData';

const userPosts = mockPosts.filter((p) => p.userId === 'u1');

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#0B0B0F]" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0B0F" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={22} color="white" />
        </Pressable>
        <Text className="text-white text-lg font-semibold">Profile</Text>
      </View>

      <FlatList
        data={userPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <View>
            {/* Profile info */}
            <View className="items-center px-4 py-6">
              <Image
                source={{ uri: mockUser.avatar }}
                className="w-24 h-24 rounded-full border-2 border-purple-600"
              />
              <Text className="text-white text-xl font-bold mt-4">
                {mockUser.displayName}
              </Text>
              <Text className="text-purple-400 text-sm mt-1">@{mockUser.username}</Text>
              <Text className="text-gray-400 text-sm text-center mt-3 leading-5">
                {mockUser.bio}
              </Text>

              {/* Stats */}
              <View className="flex-row gap-8 mt-6">
                <View className="items-center">
                  <Text className="text-white font-bold text-lg">{userPosts.length}</Text>
                  <Text className="text-gray-500 text-xs">Posts</Text>
                </View>
                <View className="items-center">
                  <Text className="text-white font-bold text-lg">{mockUser.followers.toLocaleString()}</Text>
                  <Text className="text-gray-500 text-xs">Followers</Text>
                </View>
                <View className="items-center">
                  <Text className="text-white font-bold text-lg">{mockUser.following}</Text>
                  <Text className="text-gray-500 text-xs">Following</Text>
                </View>
              </View>

              {/* Edit profile button */}
              <Pressable className="mt-5 px-8 py-2.5 border border-gray-700 rounded-full">
                <Text className="text-gray-300 text-sm font-medium">Edit Profile</Text>
              </Pressable>
            </View>

            {/* Divider */}
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
