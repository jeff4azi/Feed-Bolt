import { Image, Text, View } from 'react-native';

export default function CommentItem({ comment }) {
  return (
    <View className="flex-row mb-4">
      <Image
        source={{ uri: comment.avatar }}
        className="w-8 h-8 rounded-full mt-0.5"
      />
      <View className="ml-3 flex-1 bg-[#1a1a24] rounded-xl px-3 py-2.5">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-white font-semibold text-xs">{comment.username}</Text>
          <Text className="text-gray-600 text-xs">{comment.timestamp}</Text>
        </View>
        <Text className="text-gray-300 text-sm leading-5">{comment.content}</Text>
      </View>
    </View>
  );
}
