'use client';

import { useState, useCallback } from 'react';
import type { AnalysisResponse, AnalysisStep } from '@/lib/types';

interface UseAnalysisReturn {
  step: AnalysisStep | null;
  result: AnalysisResponse | null;
  error: string | null;
  analyzeImages: (images: string[]) => Promise<void>;
  analyzeText: (text: string) => Promise<void>;
  reset: () => void;
}

export function useAnalysis(): UseAnalysisReturn {
  const [step, setStep] = useState<AnalysisStep | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStep(null);
    setResult(null);
    setError(null);
  }, []);

  const analyze = useCallback(async (body: { images?: string[]; text?: string }) => {
    try {
      setError(null);
      setResult(null);

      // 如果是图片模式，先显示OCR步骤
      if (body.images) {
        setStep('ocr');
        await new Promise(resolve => setTimeout(resolve, 500)); // 给UI一点时间显示
        setStep('matching');
        await new Promise(resolve => setTimeout(resolve, 300));
      } else {
        setStep('matching');
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      setStep('analyzing');

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `请求失败 (${res.status})`);
      }

      const data: AnalysisResponse = await res.json();
      setResult(data);
      setStep('done');
    } catch (err) {
      const message = err instanceof Error ? err.message : '未知错误';
      setError(message);
      setStep('error');
    }
  }, []);

  const analyzeImages = useCallback((images: string[]) => analyze({ images }), [analyze]);
  const analyzeText = useCallback((text: string) => analyze({ text }), [analyze]);

  return { step, result, error, analyzeImages, analyzeText, reset };
}
