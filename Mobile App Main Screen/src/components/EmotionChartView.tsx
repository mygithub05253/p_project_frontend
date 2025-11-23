import { useState, useEffect } from 'react';
import { Loader2, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchChartStats, ChartDataPoint } from '../services/diaryApi';

type ChartType = 'line' | 'bar';
type PeriodType = 'weekly' | 'monthly';

// Emotion colors for chart
const emotionChartColors: { [key: string]: string } = {
  happy: '#fbbf24', // yellow
  love: '#f472b6', // pink
  excited: '#a78bfa', // purple
  calm: '#60a5fa', // blue
  grateful: '#34d399', // green
  hopeful: '#2dd4bf', // teal
  tired: '#9ca3af', // gray
  sad: '#818cf8', // indigo
  angry: '#ef4444', // red
  anxious: '#fb923c', // orange
  neutral: '#78716c', // stone
};

const emotionLabels: { [key: string]: string } = {
  happy: '행복',
  love: '사랑',
  excited: '설렘',
  calm: '평온',
  grateful: '감사',
  hopeful: '희망',
  tired: '피곤',
  sad: '슬픔',
  angry: '화남',
  anxious: '불안',
  neutral: '평온',
};

export function EmotionChartView() {
  const [chartType, setChartType] = useState<ChartType>('line');
  const [periodType, setPeriodType] = useState<PeriodType>('weekly');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadChartData();
  }, [periodType]);

  const loadChartData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Calculate date range based on period type
      const endDate = new Date();
      const startDate = new Date();
      
      if (periodType === 'weekly') {
        startDate.setDate(endDate.getDate() - 7);
      } else {
        startDate.setDate(endDate.getDate() - 30);
      }
      
      const startStr = formatDateString(startDate);
      const endStr = formatDateString(endDate);
      
      const data = await fetchChartStats(startStr, endStr, periodType);
      setChartData(data);
    } catch (err) {
      setError('통계 데이터를 불러오는 데 실패했습니다.');
      console.error('Failed to load chart data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Calculate emotion distribution
  const getEmotionDistribution = () => {
    const totals: { [key: string]: number } = {};
    
    chartData.forEach(dataPoint => {
      Object.keys(emotionChartColors).forEach(emotion => {
        if (!totals[emotion]) totals[emotion] = 0;
        totals[emotion] += dataPoint[emotion as keyof ChartDataPoint] as number;
      });
    });
    
    return Object.entries(totals)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Top 5 emotions
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur p-3 rounded-lg shadow-lg border border-stone-300">
          <p className="text-sm text-stone-800 mb-2">{label}</p>
          {payload
            .filter((entry: any) => entry.value > 0)
            .map((entry: any) => (
              <p key={entry.dataKey} className="text-xs" style={{ color: entry.color }}>
                {emotionLabels[entry.dataKey]}: {entry.value}회
              </p>
            ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-stone-500">
          {periodType === 'weekly' ? '최근 7일간' : '최근 30일간'} 작성된 일기가 없습니다.
        </div>
      );
    }

    // Get only emotions that have data
    const activeEmotions = Object.keys(emotionChartColors).filter(emotion => {
      return chartData.some(dataPoint => dataPoint[emotion as keyof ChartDataPoint] > 0);
    });

    const ChartComponent = chartType === 'line' ? LineChart : BarChart;
    const DataComponent = chartType === 'line' ? Line : Bar;

    return (
      <ResponsiveContainer width="100%" height={300}>
        <ChartComponent data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d6d3d1" opacity={0.3} />
          <XAxis 
            dataKey="displayLabel" 
            tick={{ fill: '#57534e', fontSize: 11 }}
            stroke="#a8a29e"
          />
          <YAxis 
            tick={{ fill: '#57534e', fontSize: 11 }}
            stroke="#a8a29e"
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '11px' }}
            formatter={(value) => emotionLabels[value] || value}
          />
          {activeEmotions.map(emotion => (
            <DataComponent
              key={emotion}
              type="monotone"
              dataKey={emotion}
              stroke={emotionChartColors[emotion]}
              fill={emotionChartColors[emotion]}
              strokeWidth={chartType === 'line' ? 2 : 0}
              dot={chartType === 'line' ? { r: 3 } : false}
            />
          ))}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  const emotionDistribution = getEmotionDistribution();

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="space-y-4">
        {/* Period Selection */}
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setPeriodType('weekly')}
            className={`px-4 py-2 rounded-lg transition-colors text-sm ${
              periodType === 'weekly'
                ? 'bg-amber-600 text-white'
                : 'bg-white/50 text-stone-700 hover:bg-white/80'
            }`}
          >
            주간 통계
          </button>
          <button
            onClick={() => setPeriodType('monthly')}
            className={`px-4 py-2 rounded-lg transition-colors text-sm ${
              periodType === 'monthly'
                ? 'bg-amber-600 text-white'
                : 'bg-white/50 text-stone-700 hover:bg-white/80'
            }`}
          >
            월간 통계
          </button>
        </div>

        {/* Chart Type Selection */}
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setChartType('line')}
            className={`px-4 py-2 rounded-lg transition-colors text-sm ${
              chartType === 'line'
                ? 'bg-purple-600 text-white'
                : 'bg-white/50 text-stone-700 hover:bg-white/80'
            }`}
          >
            선 그래프
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-4 py-2 rounded-lg transition-colors text-sm ${
              chartType === 'bar'
                ? 'bg-purple-600 text-white'
                : 'bg-white/50 text-stone-700 hover:bg-white/80'
            }`}
          >
            막대 그래프
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-rose-100 border border-rose-300 rounded-lg">
          <p className="text-xs text-rose-700">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
        </div>
      )}

      {/* Chart */}
      {!isLoading && !error && (
        <div className="bg-white/80 rounded-lg p-4 border border-stone-300">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-amber-700" />
            <h3 className="text-sm text-stone-800">
              {periodType === 'weekly' ? '최근 7일간' : '최근 30일간'} 감정 변화
            </h3>
          </div>
          {renderChart()}
        </div>
      )}

      {/* Emotion Summary */}
      {!isLoading && !error && emotionDistribution.length > 0 && (
        <div className="bg-white/80 rounded-lg p-4 border border-stone-300">
          <h4 className="text-sm text-stone-800 mb-3">이번 기간 주요 감정</h4>
          <div className="space-y-2">
            {emotionDistribution.map(([emotion, count]) => (
              <div key={emotion} className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: emotionChartColors[emotion] }}
                />
                <span className="text-sm text-stone-700 flex-1">
                  {emotionLabels[emotion]}
                </span>
                <span className="text-sm text-stone-800">{count}회</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
