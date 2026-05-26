'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, ImageOff, RefreshCw } from 'lucide-react';
import { Modal, Button, Input, LoadingOverlay } from '@/components/ui';
import { ImageCard, ImageForm } from '@/components/gallery';
import { GalleryImage } from '@/lib/supabase/types';
import toast from 'react-hot-toast';

export default function HomePage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch images - Optimizado para evitar lecturas fallidas de caché
  const fetchImages = useCallback(async (search = '') => {
    try {
      setIsLoading(true);
      const url = search 
        ? `/api/images?search=${encodeURIComponent(search)}`
        : '/api/images';
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache', // Fuerza al navegador a pedir datos frescos al servidor
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.error || 'Error al cargar las imágenes desde el servidor');
      }
      
      const data = await response.json();
      
      // Asegura que los datos sean siempre un array para evitar errores en el renderizado
      const validatedData = Array.isArray(data) ? data : [];
      setImages(validatedData);
      setFilteredImages(validatedData);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error(error instanceof Error ? error.message : 'Error al cargar las imágenes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Search functionality
  useEffect(() => {
    if (searchTerm) {
      const filtered = images.filter(img => 
        img.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredImages(filtered);
    } else {
      setFilteredImages(images);
    }
  }, [searchTerm, images]);

  // Create new image
  const handleCreate = async (data: { title: string; description: string; image_url: string }) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const responseClone = response.clone();
        const errorBody = await response.json().catch(() => null);
        
        console.error('--- DETALLES DEL ERROR EN EL SERVIDOR ---', {
          status: responseClone.status,
          statusText: responseClone.statusText,
          body: errorBody
        });

        throw new Error(errorBody?.error || `Error ${responseClone.status}: No se pudo crear la imagen`);
      }

      toast.success('Imagen creada exitosamente');
      setIsModalOpen(false);
      fetchImages(searchTerm);
    } catch (error) {
      console.error('Error creating image:', error);
      toast.error(error instanceof Error ? error.message : 'Error al crear la imagen');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update image
  const handleUpdate = async (data: { title: string; description: string; image_url: string }) => {
    if (!editingImage) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/images/${editingImage.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const responseClone = response.clone();
        const errorBody = await response.json().catch(() => null);
        
        console.error('--- DETALLES DEL ERROR EN EL SERVIDOR (UPDATE) ---', {
          status: responseClone.status,
          statusText: responseClone.statusText,
          body: errorBody
        });

        throw new Error(errorBody?.error || `Error ${responseClone.status}: No se pudo actualizar la imagen`);
      }

      toast.success('Imagen actualizada exitosamente');
      setIsModalOpen(false);
      setEditingImage(null);
      fetchImages(searchTerm);
    } catch (error) {
      console.error('Error updating image:', error);
      toast.error(error instanceof Error ? error.message : 'Error al actualizar la imagen');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete image
  const handleDelete = async (image: GalleryImage) => {
    try {
      const response = await fetch(`/api/images/${image.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la imagen de la base de datos');
      }

      // Delete from blob storage
      try {
        await fetch(`/api/upload?url=${encodeURIComponent(image.image_url)}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Error deleting from blob:', error);
      }

      toast.success('Imagen personalizada eliminada exitosamente');
      fetchImages(searchTerm);
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Error al eliminar la imagen');
    }
  };

  // Open modal for create
  const openCreateModal = () => {
    setEditingImage(null);
    setIsModalOpen(true);
  };

  // Open modal for edit
  const openEditModal = (image: GalleryImage) => {
    setEditingImage(image);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl">
                <ImageOff className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Galería de Imágenes
              </h1>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <Input
                  placeholder="Buscar por título..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                  className="pl-9"
                />
              </div>

              {/* Create Button */}
              <Button
                variant="primary"
                onClick={openCreateModal}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Nueva Imagen
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-gray-600 dark:text-gray-400">Cargando imágenes...</p>
            </div>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <ImageOff className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'No se encontraron resultados' : 'No hay imágenes'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm 
                ? 'Intenta con otro término de búsqueda'
                : 'Comienza agregando tu primera imagen a la galería'
              }
            </p>
            {!searchTerm && (
              <Button
                variant="primary"
                onClick={openCreateModal}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Agregar Imagen
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <ImageCard
                key={image.id}
                image={image}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal for Create/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingImage ? 'Editar Imagen' : 'Nueva Imagen'}
      >
        <ImageForm
          initialData={editingImage || undefined}
          onSubmit={editingImage ? handleUpdate : handleCreate}
          onCancel={closeModal}
        />
      </Modal>

      {/* Loading Overlay */}
      {isSubmitting && <LoadingOverlay message="Procesando..." />}
    </div>
  );
}