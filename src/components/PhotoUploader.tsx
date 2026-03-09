'use client';

import { useState, useRef } from 'react';

interface PhotoUploaderProps {
  onImagesSelected: (images: string[]) => void;
  disabled?: boolean;
}

export default function PhotoUploader({ onImagesSelected, disabled }: PhotoUploaderProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newPreviews: string[] = [...previews];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        newPreviews.push(result);
        // 当所有文件都读完了，更新状态
        if (newPreviews.length === previews.length + files.length) {
          setPreviews([...newPreviews]);
          onImagesSelected([...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onImagesSelected(newPreviews);
  };

  return (
    <div className="space-y-4">
      {/* 图片预览区 */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {previews.map((src, index) => (
            <div key={index} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-slate-200">
              <img src={src} alt={`合同第${index + 1}页`} className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center shadow"
                disabled={disabled}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 上传按钮区域 */}
      <div
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
          ${disabled ? 'border-slate-200 bg-slate-50 cursor-not-allowed' : 'border-blue-300 hover:border-blue-400 hover:bg-blue-50'}`}
      >
        <div className="text-4xl mb-2">📸</div>
        <p className="text-sm font-medium text-slate-700">
          {previews.length > 0 ? '继续添加合同照片' : '拍照或上传合同照片'}
        </p>
        <p className="text-xs text-slate-400 mt-1">
          支持 JPG、PNG 格式，可多选
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
}
