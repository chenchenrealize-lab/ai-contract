'use client';

import { useState } from 'react';
import type { RiskItem as RiskItemType } from '@/lib/types';

interface RiskItemProps {
  item: RiskItemType;
  index: number;
}

const levelConfig = {
  red: { label: '高危', bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-500', icon: '🔴' },
  yellow: { label: '注意', bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-500', icon: '🟡' },
  green: { label: '合理', bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-500', icon: '🟢' },
};

export default function RiskItem({ item, index }: RiskItemProps) {
  const [expanded, setExpanded] = useState(item.level === 'red'); // 高危项默认展开
  const config = levelConfig[item.level];

  return (
    <div className={`rounded-xl border ${config.border} ${config.bg} overflow-hidden transition-all`}>
      {/* 标题栏 - 点击展开/收起 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center gap-3 text-left"
      >
        <span className="text-lg">{config.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs px-1.5 py-0.5 rounded text-white font-medium" style={{ backgroundColor: item.level === 'red' ? '#dc2626' : item.level === 'yellow' ? '#f59e0b' : '#16a34a' }}>
              {config.label}
            </span>
            <span className="text-xs text-slate-400">{item.category}</span>
          </div>
          <p className="text-sm font-medium text-slate-800 truncate">{item.riskDescription}</p>
        </div>
        <span className={`text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* 展开内容 */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* 原文摘录 */}
          <div className="bg-white/60 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">📋 合同原文</p>
            <p className="text-sm text-slate-700 italic">&ldquo;{item.clause}&rdquo;</p>
          </div>

          {/* 法律依据 */}
          <div className="bg-white/60 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">⚖️ 法律依据</p>
            <p className="text-sm text-slate-700">{item.legalBasis}</p>
          </div>

          {/* 谈判建议 */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <p className="text-xs text-blue-500 mb-1">💬 谈判话术</p>
            <p className="text-sm text-blue-800 font-medium">{item.negotiationAdvice}</p>
          </div>

          {/* 参考判例 */}
          {item.relatedCase && (
            <div className="bg-white/60 rounded-lg p-3">
              <p className="text-xs text-slate-400 mb-1">📖 参考判例</p>
              <p className="text-sm text-slate-700">{item.relatedCase}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
