import React from "react";
import { Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis } from 'recharts';


export default function Radarchart({data}) {
  const chartData = data.chartData
  console.log(chartData,'456')
  return (
    <RadarChart cx={300} cy={250} outerRadius={150} width={500} height={500} data={chartData}>
      <PolarGrid />
      <PolarAngleAxis dataKey="Category" />
      <PolarRadiusAxis angle={30} domain={[0, 150]} />
      <Radar name="Budget" dataKey="Budget" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
      <Radar name="Expenses" dataKey="Expenses" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
      <Legend />
    </RadarChart>
  );
}
