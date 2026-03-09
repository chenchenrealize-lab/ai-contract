import { NextRequest, NextResponse } from 'next/server';
import { recognizeMultipleImages } from '@/lib/ocr/tesseract';
import { analyzeContract } from '@/lib/ai/deepseek';
import { parseAnalysisResponse } from '@/lib/ai/parser';

export const maxDuration = 60; // 最长执行时间60秒（OCR+AI分析需要时间）

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { images, text } = body;

    let contractText = '';

    if (text) {
      // 直接使用文本（示例合同模式，跳过OCR）
      contractText = text;
    } else if (images && images.length > 0) {
      // 从图片中OCR识别文字
      const buffers = images.map((img: string) => {
        // 移除base64前缀（如 "data:image/jpeg;base64,"）
        const base64Data = img.replace(/^data:image\/\w+;base64,/, '');
        return Buffer.from(base64Data, 'base64');
      });
      contractText = await recognizeMultipleImages(buffers);

      if (!contractText.trim()) {
        return NextResponse.json(
          { error: '无法从图片中识别出文字，请确保图片清晰且包含文字内容' },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: '请上传合同图片或提供合同文本' },
        { status: 400 }
      );
    }

    // 调用DeepSeek分析合同
    const aiResponse = await analyzeContract(contractText);

    // 解析AI返回的结果
    const result = parseAnalysisResponse(aiResponse, contractText);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    const message = error instanceof Error ? error.message : '分析过程中出现未知错误';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
