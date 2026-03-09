import OpenAI from 'openai';
import { SYSTEM_PROMPT, buildUserPrompt } from './prompts';
import { buildRagContext } from '../rag/knowledge';

// DeepSeek API客户端 - 使用OpenAI兼容格式
// （DeepSeek的API接口和OpenAI格式一样，所以可以直接用OpenAI的SDK）
const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseURL: 'https://api.deepseek.com',
});

export async function analyzeContract(contractText: string): Promise<string> {
  // 第一步：构建RAG上下文（把知识库内容匹配出来）
  const ragContext = buildRagContext(contractText);

  // 第二步：构建完整的用户消息
  const userPrompt = buildUserPrompt(contractText, ragContext);

  // 第三步：调用DeepSeek API
  const response = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.1,        // 低温度 = 更稳定的输出（分析任务不需要创意）
    max_tokens: 3000,         // 限制输出长度，加快响应速度
    response_format: { type: 'json_object' }, // 强制JSON输出
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('DeepSeek API 返回了空响应');
  }

  return content;
}
