import type { OverallRisk } from '@/lib/types';

interface RiskSummaryProps {
  overallRisk: OverallRisk;
  overallScore: number;
  summary: string;
  riskCounts: { red: number; yellow: number; green: number };
}

const riskConfig = {
  high: { label: '高风险', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', emoji: '🚨' },
  medium: { label: '中风险', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', emoji: '⚠️' },
  low: { label: '低风险', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', emoji: '✅' },
};

export default function RiskSummary({ overallRisk, overallScore, summary, riskCounts }: RiskSummaryProps) {
  const config = riskConfig[overallRisk];

  // 根据分数计算环形进度条
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;
  const scoreColor = overallScore >= 70 ? '#16a34a' : overallScore >= 50 ? '#f59e0b' : '#dc2626';

  return (
    <div className={`rounded-xl p-6 ${config.bg} ${config.border} border`}>
      <div className="flex items-center gap-4">
        {/* 分数环 */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="6" />
            <circle
              cx="50" cy="50" r="45" fill="none"
              stroke={scoreColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold" style={{ color: scoreColor }}>{overallScore}</span>
            <span className="text-[10px] text-slate-400">安全分</span>
          </div>
        </div>

        {/* 文字信息 */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{config.emoji}</span>
            <span className={`text-lg font-bold ${config.color}`}>{config.label}</span>
          </div>
          <div className="flex gap-3 text-xs">
            <span className="text-red-600">🔴 {riskCounts.red} 个高危</span>
            <span className="text-yellow-600">🟡 {riskCounts.yellow} 个注意</span>
            <span className="text-green-600">🟢 {riskCounts.green} 个合理</span>
          </div>
        </div>
      </div>

      {/* 总结 */}
      <p className="mt-4 text-sm text-slate-700 leading-relaxed">{summary}</p>
    </div>
  );
}
