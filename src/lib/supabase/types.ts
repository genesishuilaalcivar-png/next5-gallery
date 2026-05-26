export interface GalleryImage {
  id: string;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface CreateGalleryImageInput {
  title: string;
  description: string;
  image_url: string;
}

export interface UpdateGalleryImageInput {
  title?: string;
  description?: string;
  image_url?: string;
}