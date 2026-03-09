import { NextResponse } from 'next/server';

export async function GET() {
  const key = process.env.DEEPSEEK_API_KEY || '';
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    hasApiKey: !!key,
    keyPrefix: key.substring(0, 5),    // 只显示前5位，用于调试
    keyLength: key.length,              // Key长度
  });
}
