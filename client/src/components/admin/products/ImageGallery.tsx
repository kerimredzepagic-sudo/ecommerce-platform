"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  Upload,
  X,
  GripVertical,
  Star,
  Loader2,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useImageUpload } from "@/hooks/useImageUpload";
import { cn } from "@/lib/utils";

export interface ProductImage {
  url: string;
  alt?: string;
  isPrimary?: boolean;
  order?: number;
}

interface ImageGalleryProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  maxImages?: number;
  folder?: string;
}

export function ImageGallery({
  images,
  onChange,
  maxImages = 10,
  folder = "products",
}: ImageGalleryProps) {
  const [editingAlt, setEditingAlt] = useState<number | null>(null);
  const { uploadFiles, removeFile, isUploading, uploadProgress } =
    useImageUpload(folder);

  // Handle file drop
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (images.length + acceptedFiles.length > maxImages) {
        alert(`Maksimalno ${maxImages} slika dozvoljeno`);
        return;
      }

      try {
        const results = await uploadFiles(acceptedFiles);
        const newImages: ProductImage[] = results.map((result, index) => ({
          url: result.url,
          alt: "",
          isPrimary: images.length === 0 && index === 0, // First image is primary if no images exist
        }));
        onChange([...images, ...newImages]);
      } catch (error) {
        console.error("Upload error:", error);
      }
    },
    [images, onChange, uploadFiles, maxImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/gif": [".gif"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isUploading,
  });

  // Handle drag end for reordering
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange(items);
  };

  // Set primary image
  const setPrimaryImage = (index: number) => {
    const updatedImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    onChange(updatedImages);
  };

  // Update alt text
  const updateAltText = (index: number, alt: string) => {
    const updatedImages = [...images];
    updatedImages[index] = { ...updatedImages[index], alt };
    onChange(updatedImages);
  };

  // Remove image
  const handleRemoveImage = async (index: number) => {
    const image = images[index];
    try {
      await removeFile(image.url);
    } catch (error) {
      // Continue even if delete from storage fails
      console.error("Failed to delete from storage:", error);
    }

    const updatedImages = images.filter((_, i) => i !== index);
    // If removed image was primary, make first image primary
    if (image.isPrimary && updatedImages.length > 0) {
      updatedImages[0].isPrimary = true;
    }
    onChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-orange-500 bg-orange-50"
            : "border-gray-300 hover:border-orange-400 hover:bg-gray-50",
          isUploading && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          {isUploading ? (
            <>
              <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
              <p className="text-gray-600">Uploadovanje...</p>
            </>
          ) : (
            <>
              <Upload className="w-10 h-10 text-gray-400" />
              <p className="text-gray-600">
                {isDragActive
                  ? "Otpustite slike ovdje"
                  : "Prevucite slike ovdje ili kliknite za odabir"}
              </p>
              <p className="text-sm text-gray-400">
                JPEG, PNG, WebP, GIF (max 10MB po slici)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <div className="space-y-2">
          {uploadProgress.map((progress, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
              <span className="text-sm text-gray-600 flex-1">
                {progress.fileName}
              </span>
              <span className="text-xs text-gray-400">
                {progress.status === "uploading" ? "Uploading..." : progress.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Image Gallery */}
      {images.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="images" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {images.map((image, index) => (
                  <Draggable
                    key={image.url}
                    draggableId={image.url}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "relative group bg-white rounded-lg border overflow-hidden",
                          snapshot.isDragging && "shadow-lg ring-2 ring-orange-500",
                          image.isPrimary && "ring-2 ring-orange-500"
                        )}
                      >
                        {/* Image */}
                        <div className="aspect-square relative">
                          <img
                            src={image.url}
                            alt={image.alt || "Slika proizvoda"}
                            className="w-full h-full object-cover"
                          />

                          {/* Primary Badge */}
                          {image.isPrimary && (
                            <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" />
                              Glavna
                            </div>
                          )}

                          {/* Overlay with actions */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            {/* Drag Handle */}
                            <div
                              {...provided.dragHandleProps}
                              className="p-2 bg-white rounded-lg cursor-grab"
                            >
                              <GripVertical className="w-4 h-4 text-gray-600" />
                            </div>

                            {/* Set Primary */}
                            {!image.isPrimary && (
                              <Button
                                type="button"
                                size="icon"
                                variant="secondary"
                                onClick={() => setPrimaryImage(index)}
                                title="Postavi kao glavnu sliku"
                              >
                                <Star className="w-4 h-4" />
                              </Button>
                            )}

                            {/* Delete */}
                            <Button
                              type="button"
                              size="icon"
                              variant="destructive"
                              onClick={() => handleRemoveImage(index)}
                              title="Obriši sliku"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Alt Text Input */}
                        <div className="p-2 border-t">
                          {editingAlt === index ? (
                            <Input
                              value={image.alt || ""}
                              onChange={(e) => updateAltText(index, e.target.value)}
                              onBlur={() => setEditingAlt(null)}
                              onKeyDown={(e) =>
                                e.key === "Enter" && setEditingAlt(null)
                              }
                              placeholder="Alt tekst..."
                              className="text-xs h-7"
                              autoFocus
                            />
                          ) : (
                            <button
                              type="button"
                              onClick={() => setEditingAlt(index)}
                              className="text-xs text-gray-500 hover:text-gray-700 w-full text-left truncate"
                            >
                              {image.alt || "Dodaj alt tekst..."}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Empty State */}
      {images.length === 0 && !isUploading && (
        <div className="text-center py-8 text-gray-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Nema uploadovanih slika</p>
        </div>
      )}

      {/* Image Count */}
      <div className="text-sm text-gray-500 text-right">
        {images.length} / {maxImages} slika
      </div>
    </div>
  );
}

