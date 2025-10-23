"use client";

import { useState } from "react";

interface VideoUploaderProps {
  onUpload?: (file: File) => void;
}

export default function VideoUploader({ onUpload }: VideoUploaderProps) {
  const [video, setVideo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideo(file);
    setPreview(URL.createObjectURL(file));

    if (onUpload) onUpload(file);
  };

  const handleRemove = () => {
    setVideo(null);
    setPreview(null);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <label
        htmlFor="video-upload"
        className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center transition-colors hover:border-blue-500 dark:hover:border-blue-400"
      >
        {!preview ? (
          <>
            <svg
              className="w-12 h-12 mb-2 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A2 2 0 0122 9.618v4.764a2 2 0 01-2.447 1.894L15 14M4 6h16M4 6v12M4 18h16"
              />
            </svg>
            <span className="text-gray-600 dark:text-gray-400">
              Click or drag your video here
            </span>
          </>
        ) : (
          <video
            src={preview}
            className="rounded-lg max-h-48 w-full object-cover"
            controls
          />
        )}
        <input
          id="video-upload"
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {video && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
            {video.name}
          </p>
          <button
            onClick={handleRemove}
            className="text-red-500 hover:text-red-600 dark:hover:text-red-400 text-sm font-medium transition-colors"
          >
            Remove
          </button>
        </div>
      )}

      {uploading && (
        <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full w-1/2 animate-pulse" />
        </div>
      )}
    </div>
  );
}
