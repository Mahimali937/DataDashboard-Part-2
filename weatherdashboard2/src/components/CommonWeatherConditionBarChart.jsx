import React from 'react';
import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  CartesianGrid,
} from 'recharts';
import './graphs.css';

const CommonWeatherConditionBarChart = ({ data }) => {
  const processedData = data.reduce((acc, item) => {
    const condition = item.mostCommonWeatherCondition.toLowerCase();
    let category = '';

    if (condition.includes('clear')) {
      category = 'Clear';
    } else if (condition.includes('clouds')) {
      category = 'Clouds';
    } else if (condition.includes('rain') || condition.includes('drizzle')) {
      category = 'Rain';
    } else if (condition.includes('snow')) {
      category = 'Snow';
    }

    if (category && !acc[category]) {
      acc[category] = { mostCommonWeatherCondition: category, count: item.count };
    } else if (category) {
      acc[category].count += item.count;
    }

    return acc;
  }, {});

  const chartData = Object.values(processedData);

  const categories = ['Clear', 'Clouds', 'Rain', 'Snow'];
  const finalData = categories.map(category => processedData[category] || { mostCommonWeatherCondition: category, count: 0 });

  return (
    <div className='graph'>
      <h2 className='graph-title'>Most Common Weather Conditions</h2>
      <BarChart
        width={600}
        height={300}
        data={finalData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='mostCommonWeatherCondition' />
        <YAxis type="number" domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} />
        <Tooltip />
        <Bar
          dataKey='count'
          fill='#82ca9d'
        />
      </BarChart>
    </div>
  );
};

export default CommonWeatherConditionBarChart;



