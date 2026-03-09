'use client';

import { useState } from 'react';
import PhotoUploader from '@/components/PhotoUploader';
import SampleContracts from '@/components/SampleContracts';
import AnalysisProgress from '@/components/AnalysisProgress';
import RiskReport from '@/components/RiskReport';
import { useAnalysis } from '@/hooks/useAnalysis';

export default function Home() {
  const [images, setImages] = useState<string[]>([]);
  const { step, result, error, analyzeImages, analyzeText, reset } = useAnalysis();

  const isAnalyzing = step !== null && step !== 'done' && step !== 'error';

  const handleAnalyze = () => {
    if (images.length === 0) return;
    analyzeImages(images);
  };

  const handleSample = (text: string) => {
    analyzeText(text);
  };

  const handleReset = () => {
    setImages([]);
    reset();
  };

  // 显示结果页面
  if (result) {
    return (
      <div className="space-y-4">
        <button
          onClick={handleReset}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          ← 重新分析
        </button>
        <RiskReport data={result} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 产品介绍 */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">租房合同，拍照就能查风险</h2>
        <p className="text-sm text-slate-500">
          AI 帮你逐条分析合同条款，识别霸王条款，给出谈判话术
        </p>
      </div>

      {/* 分析进度 */}
      {isAnalyzing && <AnalysisProgress currentStep={step!} />}

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700">❌ {error}</p>
          <button
            onClick={handleReset}
            className="mt-2 text-sm text-red-600 underline"
          >
            重试
          </button>
        </div>
      )}

      {/* 上传区域（分析中时禁用） */}
      {!isAnalyzing && !error && (
        <>
          <PhotoUploader onImagesSelected={setImages} disabled={isAnalyzing} />

          {/* 开始分析按钮 */}
          {images.length > 0 && (
            <button
              onClick={handleAnalyze}
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all"
            >
              开始分析 ({images.length} 张照片)
            </button>
          )}

          {/* 分隔线 */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">或者</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* 示例合同 */}
          <SampleContracts onSelectSample={handleSample} disabled={isAnalyzing} />
        </>
      )}
    </div>
  );
}
