import * as ImagePicker from 'expo-image-picker';

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

/**
 * Injects Cloudinary transformation params into a secure_url.
 * Only applies to Cloudinary URLs — passes other URLs through unchanged.
 */
export function getOptimizedImageUrl(url, options = {}) {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  const {
    format = 'f_auto',
    quality = 'q_auto',
    width = 'w_800',
    crop = 'c_limit',
  } = options;
  const transforms = [format, quality, width, crop].filter(Boolean).join(',');
  return url.replace('/upload/', `/upload/${transforms}/`);
}

function getMimeType(asset) {
  const ext = (asset.fileName ?? asset.uri ?? '').split('.').pop()?.toLowerCase();
  const mimeMap = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', heic: 'image/heic' };
  return asset.mimeType ?? mimeMap[ext ?? ''] ?? 'image/jpeg';
}

/**
 * Opens the image picker and returns the asset for preview + later upload.
 * base64 is included so we can send it to the backend on post.
 * @returns {Promise<{uri, ratio, base64, mimeType, fileName}|null>}
 */
export async function pickImage() {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') throw new Error('Media library permission denied.');

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false,
    quality: 0.8,
    base64: true,
  });

  if (result.canceled || !result.assets?.length) return null;

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    ratio: asset.width && asset.height ? asset.width / asset.height : 1,
    base64: asset.base64,
    mimeType: getMimeType(asset),
    fileName: asset.fileName ?? `upload.${getMimeType(asset).split('/')[1] ?? 'jpg'}`,
  };
}

/**
 * Uploads a picked asset to Cloudinary via the backend.
 * Sends raw base64 (no data URI prefix).
 * @returns {Promise<{image_url: string, image_public_id: string}>}
 */
export async function uploadImage(asset) {
  const res = await fetch(`${BASE_URL}/upload-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      file: asset.base64,
      mimeType: asset.mimeType,
      fileName: asset.fileName,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Image upload failed.');
  return { image_url: data.image_url, image_public_id: data.image_public_id };
}

/**
 * Deletes a post's image via the backend (Cloudinary + clears DB fields).
 */
export async function deletePostImage(postId) {
  const res = await fetch(`${BASE_URL}/delete-post-image`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ postId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Failed to delete image (${res.status}).`);
  }
}

/**
 * Deletes a post by ID via the backend API.
 */
export async function deletePost(postId) {
  const res = await fetch(`${BASE_URL}/posts/${postId}`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `Failed to delete post (${res.status}).`);
  }
}
