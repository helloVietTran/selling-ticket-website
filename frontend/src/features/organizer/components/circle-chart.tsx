import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

type CircleChartProps = {
  percent: number | string;
  size?: number;
  colors?: [string, string];
  fontSize?: string;
};

export default function CircleChart({
  percent,
  size = 96,
  colors = ['#22c55e', '#facc15'],
  fontSize = '1rem',
}: CircleChartProps) {
  const numericPercent = Math.min(100, Math.max(0, Number(percent)));

  const data = [
    { name: 'progress', value: numericPercent },
    { name: 'remain', value: 100 - numericPercent },
  ];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            innerRadius="65%"
            outerRadius="100%"
            stroke="none">
            {data.map((_, i) => (
              <Cell key={`cell-${i}`} fill={colors[i]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <span
        className="absolute inset-0 flex items-center justify-center font-bold"
        style={{ fontSize }}>
        {numericPercent.toFixed(2)}%
      </span>
    </div>
  );
}
