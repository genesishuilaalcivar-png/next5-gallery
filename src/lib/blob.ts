import { put, del, list } from '@vercel/blob';

export async function uploadImage(
  filename: string,
  file: Blob | Buffer | string,
  options?: {
    contentType?: string;
    cacheControlMaxAge?: number;
  }
) {
  const result = await put(filename, file, {
    access: 'public',
    addRandomSuffix: true,
    ...options,
  });
  return result;
}

export async function deleteImage(url: string) {
  await del(url);
}

export async function listImages() {
  const { blobs } = await list();
  return blobs;
}