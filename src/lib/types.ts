// 风险等级类型 (risk level)
export type RiskLevel = 'red' | 'yellow' | 'green';
// 整体风险评级 (overall risk rating)
export type OverallRisk = 'high' | 'medium' | 'low';

// 单个风险项 (individual risk item)
export interface RiskItem {
  level: RiskLevel;
  clause: string;           // 原文摘录
  riskDescription: string;  // 风险说明
  legalBasis: string;       // 法律依据
  negotiationAdvice: string; // 谈判话术
  relatedCase?: string;     // 参考判例
  category: string;         // 分类（押金/租金/维修/退租等）
}

// 合同缺失项 (missing clause)
export interface MissingClause {
  name: string;             // 缺失条款名称
  importance: 'critical' | 'important' | 'recommended';
  description: string;      // 为什么需要这个条款
  suggestion: string;       // 建议补充的内容
}

// 分析响应 (analysis response)
export interface AnalysisResponse {
  extractedText: string;
  overallRisk: OverallRisk;
  overallScore: number;     // 0-100，越高越安全
  risks: RiskItem[];
  missingClauses: MissingClause[];
  summary: string;          // 总体建议
}

// 分析请求 (analysis request)
export interface AnalysisRequest {
  images?: string[];        // base64 encoded images
  text?: string;            // direct text input (for sample contracts)
}

// 分析进度 (analysis progress)
export type AnalysisStep = 'ocr' | 'matching' | 'analyzing' | 'done' | 'error';

export interface AnalysisProgress {
  step: AnalysisStep;
  message: string;
  percentage: number;
}
