"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export const useFile = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();

    if (result.error) throw new Error(result.error);

    console.log(result);

    const { docId } = result;
    setIsUploading(false);

    router.push(`/chat/${docId}`);
  };

  return {
    isDragOver,
    isUploading,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    handleUpload,
  };
};
