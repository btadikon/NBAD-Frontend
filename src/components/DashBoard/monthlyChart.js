import React, { useState, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";


export default function MonthCharts({data}) {
    const dailyExpensesData = data.dailyExpensesData
  const [opacity, setOpacity] = useState({
    uv: 1,
    pv: 1
  });

  const handleMouseEnter = useCallback(
    (o) => {
      const { dataKey } = o;

      setOpacity({ ...opacity, [dataKey]: 0.5 });
    },
    [opacity, setOpacity]
  );

  const handleMouseLeave = useCallback(
    (o) => {
      const { dataKey } = o;
      setOpacity({ ...opacity, [dataKey]: 1 });
    },
    [opacity, setOpacity]
  );

  return (
    <div>
      <LineChart
        width={1500}
        height={300}
        data={dailyExpensesData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Date" />
        <YAxis />
        <Tooltip />
        <Legend
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
        <Line
          type="monotone"
          dataKey="Expense"
          strokeOpacity={opacity.pv}
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
      <p className="notes">Tips: Hover the legend !</p>
    </div>
  );
}
