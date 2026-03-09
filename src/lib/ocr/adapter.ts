// OCR适配器接口 - 方便以后切换不同的OCR方案
export interface OcrAdapter {
  recognize(imageBuffer: Buffer): Promise<string>;
}
