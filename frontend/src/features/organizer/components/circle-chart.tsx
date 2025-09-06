import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

type CircleChartProps = {
  percent: number;
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
  const data = [
    { name: 'progress', value: percent },
    { name: 'remain', value: 100 - percent },
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
            stroke="none"
          >
            <Cell fill={colors[0]} />
            <Cell fill={colors[1]} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <span
        className="absolute inset-0 flex items-center justify-center font-bold"
        style={{ fontSize }}
      >
        {percent}%
      </span>
    </div>
  );
}
