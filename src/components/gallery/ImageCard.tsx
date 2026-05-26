'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import { GalleryImage } from '@/lib/supabase/types';
import Button from '../ui/Button';

interface ImageCardProps {
  image: GalleryImage;
  onEdit: (image: GalleryImage) => void;
  onDelete: (image: GalleryImage) => void;
}

export default function ImageCard({ image, onEdit, onDelete }: ImageCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta imagen?')) return;
    
    setIsDeleting(true);
    await onDelete(image);
    setIsDeleting(false);
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        )}
        <Image
          src={image.image_url}
          alt={image.title}
          fill
          className={`object-cover transition-transform duration-500 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex gap-2 justify-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(image)}
              leftIcon={<Pencil className="w-4 h-4" />}
              disabled={isDeleting}
            >
              Editar
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              leftIcon={<Trash2 className="w-4 h-4" />}
              isLoading={isDeleting}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate mb-1">
          {image.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {image.description}
        </p>
      </div>
    </div>
  );
}