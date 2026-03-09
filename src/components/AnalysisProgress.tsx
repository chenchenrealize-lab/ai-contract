'use client';

import type { AnalysisStep } from '@/lib/types';

interface AnalysisProgressProps {
  currentStep: AnalysisStep;
}

const steps = [
  { key: 'ocr' as const, label: '识别文字', icon: '📝' },
  { key: 'matching' as const, label: '匹配法规', icon: '📚' },
  { key: 'analyzing' as const, label: 'AI分析中', icon: '🤖' },
];

export default function AnalysisProgress({ currentStep }: AnalysisProgressProps) {
  const currentIndex = steps.findIndex(s => s.key === currentStep);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <p className="text-center text-sm font-medium text-slate-700 mb-6">
        正在分析您的合同，请稍候...
      </p>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentIndex;
          const isDone = index < currentIndex || currentStep === 'done';

          return (
            <div key={step.key} className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-2 transition-all
                  ${isDone ? 'bg-green-100' : isActive ? 'bg-blue-100 animate-pulse' : 'bg-slate-100'}`}
              >
                {isDone ? '✅' : step.icon}
              </div>
              <span className={`text-xs ${isActive ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>
                {step.label}
              </span>
              {/* 连接线 */}
              {index < steps.length - 1 && (
                <div className="hidden" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
