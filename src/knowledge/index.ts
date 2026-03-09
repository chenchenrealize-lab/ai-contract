// 知识库加载器 - 汇总所有租房法律知识和风险数据
import civilCode from './civil-code.json';
import rentalRegulations from './rental-regulations.json';
import commonPitfalls from './common-pitfalls.json';
import contractChecklist from './contract-checklist.json';
import caseStudies from './case-studies.json';

export { civilCode, rentalRegulations, commonPitfalls, contractChecklist, caseStudies };

/**
 * 将所有知识库内容合并为一段文本，用于注入到 AI 提示词中
 * 这样 AI 在分析合同时就能参考完整的法律知识和常见陷阱
 */
export function getAllKnowledgeText(): string {
  const sections: string[] = [];

  // 民法典租赁合同条款
  sections.push('## 民法典·租赁合同相关条款');
  civilCode.articles.forEach((a: { number: string; title: string; content: string }) => {
    sections.push(`第${a.number}条（${a.title}）：${a.content}`);
  });

  // 商品房屋租赁管理办法
  sections.push('\n## 商品房屋租赁管理办法');
  rentalRegulations.articles.forEach((a: { number: string; content: string }) => {
    sections.push(`第${a.number}条：${a.content}`);
  });

  // 常见租房坑
  sections.push('\n## 常见租房坑');
  commonPitfalls.pitfalls.forEach((p: {
    category: string;
    name: string;
    description: string;
    warningSignals: string[];
    negotiationAdvice: string;
  }) => {
    sections.push(
      `【${p.category}】${p.name}：${p.description}。警示信号：${p.warningSignals.join('、')}。谈判建议：${p.negotiationAdvice}`
    );
  });

  // 合同必备条款清单
  sections.push('\n## 合同必备条款清单');
  contractChecklist.categories.forEach((cat: {
    name: string;
    items: Array<{ name: string; importance: string; description: string; missingRisk: string }>;
  }) => {
    cat.items.forEach((item) => {
      sections.push(
        `【${cat.name}】${item.name}（${item.importance}）：${item.description}。缺失风险：${item.missingRisk}`
      );
    });
  });

  // 典型判例参考
  sections.push('\n## 典型判例参考');
  caseStudies.cases.forEach((c: {
    category: string;
    title: string;
    facts: string;
    ruling: string;
    lesson: string;
  }) => {
    sections.push(
      `【${c.category}】${c.title}：${c.facts} 判决：${c.ruling} 启示：${c.lesson}`
    );
  });

  return sections.join('\n');
}
