import { commonPitfalls, contractChecklist, caseStudies } from '@/knowledge';

// 关键词匹配结果
interface MatchResult {
  matchedPitfalls: string[];   // 匹配到的坑的ID
  matchedCases: string[];      // 匹配到的判例ID
  matchedChecklist: string[];  // 匹配到的检查项ID
  keywords: string[];          // 命中的关键词
}

// 从合同文本中匹配知识库条目
export function matchKnowledge(contractText: string): MatchResult {
  const result: MatchResult = {
    matchedPitfalls: [],
    matchedCases: [],
    matchedChecklist: [],
    keywords: [],
  };

  const text = contractText.toLowerCase();

  // 匹配常见坑
  commonPitfalls.pitfalls.forEach(pitfall => {
    const matched = pitfall.keywords.some(kw => text.includes(kw.toLowerCase()));
    if (matched) {
      result.matchedPitfalls.push(pitfall.id);
      result.keywords.push(...pitfall.keywords.filter(kw => text.includes(kw.toLowerCase())));
    }
  });

  // 匹配判例
  caseStudies.cases.forEach(c => {
    const matched = c.keywords.some(kw => text.includes(kw.toLowerCase()));
    if (matched) {
      result.matchedCases.push(c.id);
    }
  });

  // 匹配检查清单（检查哪些条款缺失）
  contractChecklist.categories.forEach(cat => {
    cat.items.forEach(item => {
      const hasKeyword = item.keywords.some(kw => text.includes(kw.toLowerCase()));
      if (hasKeyword) {
        result.matchedChecklist.push(item.id);
      }
    });
  });

  // 去重关键词
  result.keywords = [...new Set(result.keywords)];

  return result;
}
