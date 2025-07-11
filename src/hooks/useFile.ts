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

    const contentType = file.type;
    const fileName = file.name;

    const generatePreSignedResponse = await fetch("/api/upload", {
      method: "POST",
      body: JSON.stringify({ contentType, fileName }),
    });
    const generatePreSignedResult = await generatePreSignedResponse.json();

    if (!generatePreSignedResult.status)
      throw new Error(generatePreSignedResult.message);

    const { docId, uploadUrl } = generatePreSignedResult.data;

    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      mode: "cors",
      body: file,
    });

    const key = new URL(uploadResponse.url).pathname.slice(1);

    const parseRespoonse = await fetch(
      `/api/parse-file?key=${key}&fileName=${fileName}`
    );

    const parseResult = await parseRespoonse.json();

    if (!parseResult.status) throw new Error(parseResult.message);

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
