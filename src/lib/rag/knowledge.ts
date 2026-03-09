import { getAllKnowledgeText } from '@/knowledge';
import { matchKnowledge } from './matcher';

// 构建RAG上下文 - 把知识库内容注入到AI提示词中
export function buildRagContext(contractText: string): string {
  // 先做关键词匹配，了解合同涉及哪些主题
  const matches = matchKnowledge(contractText);

  // 因为知识库只有约3万字，直接全量注入
  // （如果知识库超过5万字，就需要用向量数据库做语义检索了）
  const fullKnowledge = getAllKnowledgeText();

  const context = [
    '以下是租房相关法律法规和常见问题知识库，请在分析合同时参考：',
    '',
    fullKnowledge,
    '',
    `注意：根据关键词匹配，该合同可能涉及以下问题领域：${matches.keywords.join('、') || '未匹配到特定关键词，请全面分析'}`,
  ].join('\n');

  return context;
}
