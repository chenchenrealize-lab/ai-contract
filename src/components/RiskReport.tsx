import type { AnalysisResponse } from '@/lib/types';
import RiskSummary from './RiskSummary';
import RiskItem from './RiskItem';

interface RiskReportProps {
  data: AnalysisResponse;
}

export default function RiskReport({ data }: RiskReportProps) {
  const riskCounts = {
    red: data.risks.filter(r => r.level === 'red').length,
    yellow: data.risks.filter(r => r.level === 'yellow').length,
    green: data.risks.filter(r => r.level === 'green').length,
  };

  // 按风险等级排序：红→黄→绿
  const sortedRisks = [...data.risks].sort((a, b) => {
    const order = { red: 0, yellow: 1, green: 2 };
    return order[a.level] - order[b.level];
  });

  return (
    <div className="space-y-4">
      {/* 整体评分 */}
      <RiskSummary
        overallRisk={data.overallRisk}
        overallScore={data.overallScore}
        summary={data.summary}
        riskCounts={riskCounts}
      />

      {/* 风险条款列表 */}
      {sortedRisks.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-800">风险条款分析</h2>
          {sortedRisks.map((risk, index) => (
            <RiskItem key={index} item={risk} index={index} />
          ))}
        </div>
      )}

      {/* 缺失条款 */}
      {data.missingClauses.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-800">缺失条款提醒</h2>
          {data.missingClauses.map((clause, index) => (
            <div key={index} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">📝</span>
                <span className="text-sm font-medium text-slate-800">{clause.name}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  clause.importance === 'critical' ? 'bg-red-100 text-red-600' :
                  clause.importance === 'important' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {clause.importance === 'critical' ? '必须有' : clause.importance === 'important' ? '建议有' : '可选'}
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-2">{clause.description}</p>
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                <p className="text-xs text-blue-500 mb-1">建议补充</p>
                <p className="text-sm text-blue-800">{clause.suggestion}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
