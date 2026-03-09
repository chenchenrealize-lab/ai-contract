import type { AnalysisResponse, RiskItem, MissingClause } from '../types';

// 解析AI返回的JSON，做数据校验和容错处理
export function parseAnalysisResponse(raw: string, extractedText: string): AnalysisResponse {
  try {
    const parsed = JSON.parse(raw);

    // 校验并规范化风险项
    const risks: RiskItem[] = (parsed.risks || []).map((r: Record<string, unknown>) => ({
      level: validateRiskLevel(r.level as string),
      clause: String(r.clause || ''),
      riskDescription: String(r.riskDescription || ''),
      legalBasis: String(r.legalBasis || ''),
      negotiationAdvice: String(r.negotiationAdvice || ''),
      relatedCase: r.relatedCase ? String(r.relatedCase) : undefined,
      category: String(r.category || '其他'),
    }));

    // 校验并规范化缺失条款
    const missingClauses: MissingClause[] = (parsed.missingClauses || []).map((m: Record<string, unknown>) => ({
      name: String(m.name || ''),
      importance: validateImportance(m.importance as string),
      description: String(m.description || ''),
      suggestion: String(m.suggestion || ''),
    }));

    return {
      extractedText,
      overallRisk: validateOverallRisk(parsed.overallRisk),
      overallScore: Math.max(0, Math.min(100, Number(parsed.overallScore) || 50)),
      risks,
      missingClauses,
      summary: String(parsed.summary || '分析完成，请查看详细风险项。'),
    };
  } catch (e) {
    // JSON解析失败时返回一个默认响应
    console.error('Failed to parse AI response:', e);
    return {
      extractedText,
      overallRisk: 'medium',
      overallScore: 50,
      risks: [],
      missingClauses: [],
      summary: 'AI返回的结果格式异常，请重试。原始内容：' + raw.substring(0, 200),
    };
  }
}

function validateRiskLevel(level: string): 'red' | 'yellow' | 'green' {
  if (['red', 'yellow', 'green'].includes(level)) return level as 'red' | 'yellow' | 'green';
  return 'yellow';
}

function validateOverallRisk(risk: string): 'high' | 'medium' | 'low' {
  if (['high', 'medium', 'low'].includes(risk)) return risk as 'high' | 'medium' | 'low';
  return 'medium';
}

function validateImportance(importance: string): 'critical' | 'important' | 'recommended' {
  if (['critical', 'important', 'recommended'].includes(importance)) return importance as 'critical' | 'important' | 'recommended';
  return 'important';
}
