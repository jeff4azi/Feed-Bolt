import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

export function SkeletonBox({ width, height, borderRadius = 8, style }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <Animated.View
      style={[{ width, height, borderRadius, backgroundColor: '#1f1f2e', opacity }, style]}
    />
  );
}

export function PostCardSkeleton() {
  return (
    <View style={{ backgroundColor: '#121218', borderRadius: 16, padding: 16, marginBottom: 12, marginHorizontal: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <SkeletonBox width={40} height={40} borderRadius={20} />
        <View style={{ marginLeft: 12, gap: 6 }}>
          <SkeletonBox width={120} height={12} />
          <SkeletonBox width={80} height={10} />
        </View>
      </View>
      <SkeletonBox width="100%" height={14} style={{ marginBottom: 6 }} />
      <SkeletonBox width="75%" height={14} style={{ marginBottom: 16 }} />
      <SkeletonBox width="100%" height={180} borderRadius={12} style={{ marginBottom: 16 }} />
      <View style={{ flexDirection: 'row', gap: 20 }}>
        <SkeletonBox width={40} height={12} />
        <SkeletonBox width={40} height={12} />
      </View>
    </View>
  );
}

export function PostDetailSkeleton() {
  return (
    <View style={{ padding: 16 }}>
      <View style={{ backgroundColor: '#121218', borderRadius: 16, padding: 16, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <SkeletonBox width={44} height={44} borderRadius={22} />
          <View style={{ marginLeft: 12, gap: 6 }}>
            <SkeletonBox width={130} height={13} />
            <SkeletonBox width={80} height={10} />
          </View>
        </View>
        <SkeletonBox width="100%" height={14} style={{ marginBottom: 6 }} />
        <SkeletonBox width="90%" height={14} style={{ marginBottom: 6 }} />
        <SkeletonBox width="60%" height={14} style={{ marginBottom: 16 }} />
        <SkeletonBox width="100%" height={200} borderRadius={12} style={{ marginBottom: 16 }} />
        <View style={{ flexDirection: 'row', gap: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#1f2937' }}>
          <SkeletonBox width={40} height={14} />
          <SkeletonBox width={40} height={14} />
        </View>
      </View>
      {[1, 2, 3].map((i) => (
        <View key={i} style={{ flexDirection: 'row', marginBottom: 16 }}>
          <SkeletonBox width={32} height={32} borderRadius={16} />
          <View style={{ marginLeft: 12, flex: 1, backgroundColor: '#1a1a24', borderRadius: 12, padding: 10, gap: 6 }}>
            <SkeletonBox width={100} height={11} />
            <SkeletonBox width="85%" height={11} />
            <SkeletonBox width="60%" height={11} />
          </View>
        </View>
      ))}
    </View>
  );
}

export function ProfileSkeleton() {
  return (
    <View style={{ alignItems: 'center', padding: 24, gap: 12 }}>
      <SkeletonBox width={96} height={96} borderRadius={48} />
      <SkeletonBox width={140} height={16} style={{ marginTop: 8 }} />
      <SkeletonBox width={100} height={12} />
      <SkeletonBox width={80} height={12} />
      <SkeletonBox width={120} height={36} borderRadius={20} style={{ marginTop: 8 }} />
    </View>
  );
}
