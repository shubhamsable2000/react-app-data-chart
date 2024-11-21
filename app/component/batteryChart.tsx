'use client';

import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';

interface ParametersType {
  [key: string]: number;
}

interface OutputsType {
  [key: string]: number[];
}

interface MetricsType {
  [key: string]: number;
}

interface DataBlock {
  parameters: ParametersType;
  outputs: OutputsType;
  metrics: MetricsType;
}

interface BatteryChartProps {
  selectedCRates: number[];
  selectedTemperatures: number[];
  xVariable: string;
  yVariable: string;
}

export default function BatteryChart({
  selectedCRates,
  selectedTemperatures,
  xVariable,
  yVariable,
}: BatteryChartProps) {
  const [batteryData, setBatteryData] = useState<DataBlock[]>([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/results')
      .then((response) => response.json())
      .then((data: DataBlock[]) => setBatteryData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredData = batteryData.filter((dataBlock) => {
    const cRate = dataBlock.parameters['C-rate'];
    const temperature = dataBlock.parameters['Temperature [°C]'];
    const cRateMatch =
      selectedCRates.length === 0 || selectedCRates.includes(cRate);
    const tempMatch =
      selectedTemperatures.length === 0 ||
      selectedTemperatures.includes(temperature);
    return cRateMatch && tempMatch;
  });

  const allTransformedData = filteredData.map((dataBlock, blockIndex) => {
    const xData =
      dataBlock.outputs[xVariable] ??
      dataBlock.metrics[xVariable] ??
      dataBlock.parameters[xVariable];

    const yData =
      dataBlock.outputs[yVariable] ??
      dataBlock.metrics[yVariable] ??
      dataBlock.parameters[yVariable];

    if (xData === undefined || yData === undefined) {
      console.error(
        `Variable not found in data block ${blockIndex}: ${xVariable} or ${yVariable}`
      );
      return [];
    }

    const xDataArray = Array.isArray(xData) ? xData : [xData];
    const yDataArray = Array.isArray(yData) ? yData : [yData];

    if (xDataArray.length !== yDataArray.length) {
      console.error(
        `Mismatched data lengths for ${xVariable} and ${yVariable} in data block ${blockIndex}`
      );
      return [];
    }

    return xDataArray.map((xValue: number, index: number) => ({
      xValue,
      yValue: yDataArray[index],
    }));
  });

  const lineColors = [
    '#3366CC',
    '#DC3912',
    '#FF9900',
    '#109618',
    '#990099',
    '#0099C6',
    '#DD4477',
    '#66AA00',
    '#B82E2E',
  ];

  const customTooltip: React.FC<TooltipProps<number, string>> = (props) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length && payload[0].value !== undefined) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: '#fff',
            padding: '10px',
            border: '1px solid #ccc',
          }}
        >
          <p>
            <strong>{xVariable}:</strong>{' '}
            {label !== undefined ? Number(label).toFixed(2) : 'N/A'}
          </p>
          <p>
            <strong>{yVariable}:</strong> {Number(payload[0].value).toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ResponsiveContainer>
        <LineChart margin={{ top: 20, right: 40, left: 20, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="xValue"
            label={{
              value: xVariable,
              position: 'insideBottom',
              offset: -20,
              style: { textAnchor: 'middle', fontSize: 14, fill: '#666' },
            }}
            type="number"
            domain={['auto', 'auto']}
            tick={{ fontSize: 12, fill: '#666' }}
          />
          <YAxis
            label={{
              value: yVariable,
              angle: -90,
              position: 'insideLeft',
              offset: -10,
              style: { textAnchor: 'middle', fontSize: 14, fill: '#666' },
            }}
            type="number"
            domain={['auto', 'auto']}
            tick={{ fontSize: 12, fill: '#666' }}
          />
          <Tooltip content={customTooltip} />
          <Legend verticalAlign="top" wrapperStyle={{ fontSize: '12px' }} />
          {allTransformedData.map((transformedData, index) => {
            if (transformedData.length === 0) return null;

            const cRate = filteredData[index].parameters['C-rate'];
            const temperature =
              filteredData[index].parameters['Temperature [°C]'];

            return (
              <Line
                key={index}
                data={transformedData}
                dataKey="yValue"
                name={`C-rate: ${cRate}, Temp: ${temperature}°C`}
                stroke={lineColors[index % lineColors.length]}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
