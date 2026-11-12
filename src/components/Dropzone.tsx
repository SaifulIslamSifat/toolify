"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { UploadCloud, File, AlertCircle, X } from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface DropzoneProps {
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  description?: string;
  className?: string;
}

export default function Dropzone({
  accept = "image/*",
  maxSizeMB = 25,
  multiple = false,
  onFilesSelected,
  description = "Supports JPG, PNG, and WebP up to 25MB",
  className = "",
}: DropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndPassFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setError(null);

    const validFiles: File[] = [];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.size > maxSizeBytes) {
        setError(`File "${file.name}" exceeds the maximum size limit of ${maxSizeMB}MB.`);
        return;
      }
      validFiles.push(file);
      if (!multiple) break;
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    validateAndPassFiles(e.dataTransfer.files);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    validateAndPassFiles(e.target.files);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-8 sm:p-12 rounded-3xl border-2 border-dashed cursor-pointer transition-all ${
          isDragOver
            ? "border-brand-500 bg-brand-50/50 dark:bg-brand-950/20 scale-[0.99]"
            : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 hover:border-brand-400 dark:hover:border-brand-700"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white text-center">
          Drag & drop your {multiple ? "files" : "file"} here, or{" "}
          <span className="text-brand-600 dark:text-brand-400 underline decoration-2 underline-offset-4">browse</span>
        </h4>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 text-center">{description}</p>

        <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Processed safely in browser • Zero server uploads</span>
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)} className="p-1 hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
