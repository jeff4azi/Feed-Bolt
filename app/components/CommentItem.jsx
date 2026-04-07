import { Ionicons } from '@expo/vector-icons';
import { Image, Text, View } from 'react-native';

export default function CommentItem({ comment }) {
  const profile = comment.profiles;
  const avatar = profile?.avatar_url;
  const username = profile?.username ?? profile?.fullname ?? 'Unknown';
  const timestamp = new Date(comment.created_at).toLocaleDateString();

  return (
    <View className="flex-row mb-4">
      {avatar ? (
        <Image source={{ uri: avatar }} className="w-8 h-8 rounded-full mt-0.5" />
      ) : (
        <View className="w-8 h-8 rounded-full bg-[#1a1a2e] items-center justify-center mt-0.5">
          <Ionicons name="person" size={14} color="#a855f7" />
        </View>
      )}
      <View className="ml-3 flex-1 bg-[#1a1a24] rounded-xl px-3 py-2.5">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-white font-semibold text-xs">{username}</Text>
          <Text className="text-gray-600 text-xs">{timestamp}</Text>
        </View>
        <Text className="text-gray-300 text-sm leading-5">{comment.content}</Text>
      </View>
    </View>
  );
}
