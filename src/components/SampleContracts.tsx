'use client';

interface SampleContractsProps {
  onSelectSample: (text: string) => void;
  disabled?: boolean;
}

const samples = [
  {
    id: 'good',
    title: '规范合同',
    risk: '低风险',
    riskColor: 'bg-green-100 text-green-700',
    description: '条款完整、双方权利义务明确的标准合同',
    file: '/samples/sample-good.txt',
  },
  {
    id: 'risky',
    title: '问题合同',
    risk: '高风险',
    riskColor: 'bg-red-100 text-red-700',
    description: '包含多个霸王条款和不公平约定',
    file: '/samples/sample-risky.txt',
  },
  {
    id: 'missing',
    title: '缺失合同',
    risk: '中风险',
    riskColor: 'bg-yellow-100 text-yellow-700',
    description: '条款简单，缺少多项重要约定',
    file: '/samples/sample-missing.txt',
  },
];

export default function SampleContracts({ onSelectSample, disabled }: SampleContractsProps) {
  const handleClick = async (file: string) => {
    if (disabled) return;
    try {
      const res = await fetch(file);
      const text = await res.text();
      onSelectSample(text);
    } catch (err) {
      console.error('Failed to load sample:', err);
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-center">
        <p className="text-sm text-slate-500">没有合同照片？试试示例合同 👇</p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {samples.map((sample) => (
          <button
            key={sample.id}
            onClick={() => handleClick(sample.file)}
            disabled={disabled}
            className={`text-left p-4 rounded-xl border border-slate-200 bg-white shadow-sm transition-all
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md hover:border-blue-200 active:scale-[0.98]'}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-slate-800">{sample.title}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${sample.riskColor}`}>
                {sample.risk}
              </span>
            </div>
            <p className="text-xs text-slate-500">{sample.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
