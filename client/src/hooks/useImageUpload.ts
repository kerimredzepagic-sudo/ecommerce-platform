"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getTokens } from "@/lib/authClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface UploadResult {
  url: string;
  fileName: string;
  originalName: string;
  size: number;
  contentType: string;
  bucket: string;
  folder: string;
}

interface UploadProgress {
  fileName: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
}

function getAuthHeaders(): HeadersInit {
  const tokens = getTokens();
  if (!tokens) {
    throw new Error("Niste prijavljeni");
  }
  return {
    Authorization: `Bearer ${tokens.accessToken}`,
  };
}

async function uploadImage(
  file: File,
  folder: string = "products"
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", folder);

  const response = await fetch(`${API_URL}/upload/image`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Greška pri uploadu slike");
  }

  const result = await response.json();
  return result.data;
}

async function uploadImages(
  files: File[],
  folder: string = "products"
): Promise<UploadResult[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));
  formData.append("folder", folder);

  const response = await fetch(`${API_URL}/upload/images`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Greška pri uploadu slika");
  }

  const result = await response.json();
  return result.data;
}

async function deleteImage(url: string): Promise<void> {
  const tokens = getTokens();
  if (!tokens) {
    throw new Error("Niste prijavljeni");
  }

  const response = await fetch(`${API_URL}/upload/image`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokens.accessToken}`,
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Greška pri brisanju slike");
  }
}

export function useUploadImage() {
  return useMutation({
    mutationFn: ({ file, folder }: { file: File; folder?: string }) =>
      uploadImage(file, folder),
  });
}

export function useUploadImages() {
  return useMutation({
    mutationFn: ({ files, folder }: { files: File[]; folder?: string }) =>
      uploadImages(files, folder),
  });
}

export function useDeleteImage() {
  return useMutation({
    mutationFn: (url: string) => deleteImage(url),
  });
}

export function useImageUpload(folder: string = "products") {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const uploadMutation = useUploadImages();
  const deleteMutation = useDeleteImage();

  const uploadFiles = async (files: File[]): Promise<UploadResult[]> => {
    // Initialize progress
    setUploadProgress(
      files.map((file) => ({
        fileName: file.name,
        progress: 0,
        status: "pending",
      }))
    );

    try {
      // Set all to uploading
      setUploadProgress((prev) =>
        prev.map((p) => ({ ...p, status: "uploading", progress: 50 }))
      );

      const results = await uploadMutation.mutateAsync({ files, folder });

      // Set all to completed
      setUploadProgress((prev) =>
        prev.map((p) => ({ ...p, status: "completed", progress: 100 }))
      );

      // Clear progress after delay
      setTimeout(() => setUploadProgress([]), 2000);

      return results;
    } catch (error: any) {
      setUploadProgress((prev) =>
        prev.map((p) => ({
          ...p,
          status: "error",
          error: error.message,
        }))
      );
      throw error;
    }
  };

  const removeFile = async (url: string): Promise<void> => {
    await deleteMutation.mutateAsync(url);
  };

  return {
    uploadFiles,
    removeFile,
    uploadProgress,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
    uploadError: uploadMutation.error,
  };
}

