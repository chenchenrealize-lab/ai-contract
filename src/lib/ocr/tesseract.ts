import { createWorker } from 'tesseract.js';
import type { OcrAdapter } from './adapter';

// Tesseract.js OCR实现 - 用于从图片中识别中文文字
export class TesseractOcr implements OcrAdapter {
  async recognize(imageBuffer: Buffer): Promise<string> {
    // 创建OCR工作线程，加载中文+英文语言包
    const worker = await createWorker('chi_sim+eng');
    try {
      const { data: { text } } = await worker.recognize(imageBuffer);
      return text.trim();
    } finally {
      await worker.terminate();
    }
  }
}

// 从多张图片中识别文字并合并
export async function recognizeMultipleImages(images: Buffer[]): Promise<string> {
  const ocr = new TesseractOcr();
  const results: string[] = [];

  for (const image of images) {
    const text = await ocr.recognize(image);
    if (text) {
      results.push(text);
    }
  }

  return results.join('\n\n---\n\n'); // 用分隔线连接多页内容
}
