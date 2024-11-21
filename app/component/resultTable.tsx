// ResultTable.tsx
'use client';

import React, { useEffect, useState } from 'react';

interface ParametersType {
  [key: string]: number;
}

interface OutputsType {
  [key: string]: number[];
}

interface MetricsType {
  [key: string]: number;
}

interface ResultType {
  parameters: ParametersType;
  outputs: OutputsType;
  metrics: MetricsType;
}

interface ResultTableProps {
  selectedCRates: number[];
  setSelectedCRates: (rates: number[]) => void;
  selectedTemperatures: number[];
  setSelectedTemperatures: (temps: number[]) => void;
}

export default function ResultTable({
  selectedCRates,
  setSelectedCRates,
  selectedTemperatures,
  setSelectedTemperatures,
}: ResultTableProps) {
  const [results, setResults] = useState<ResultType[]>([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/results')
      .then((response) => response.json())
      .then((data: ResultType[]) => setResults(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // Filter data based on selected C-rates and Temperatures
  const filteredResults = results.filter((result) => {
    const cRate = result.parameters['C-rate'];
    const temperature = result.parameters['Temperature [°C]'];
    const cRateMatch =
      selectedCRates.length === 0 || selectedCRates.includes(cRate);
    const tempMatch =
      selectedTemperatures.length === 0 ||
      selectedTemperatures.includes(temperature);
    return cRateMatch && tempMatch;
  });

  const handleRowClick = (cRate: number, temperature: number) => {
    if (selectedCRates.includes(cRate)) {
      setSelectedCRates(selectedCRates.filter((rate) => rate !== cRate));
    } else {
      setSelectedCRates([...selectedCRates, cRate]);
    }

    if (selectedTemperatures.includes(temperature)) {
      setSelectedTemperatures(
        selectedTemperatures.filter((temp) => temp !== temperature)
      );
    } else {
      setSelectedTemperatures([...selectedTemperatures, temperature]);
    }
  };

  return (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-green-600">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              C-rate
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Temperature [°C]
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Capacity [Ah]
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Energy [Wh]
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredResults.map((result, index) => {
            const cRate = result.parameters['C-rate'];
            const temperature = result.parameters['Temperature [°C]'];
            const isSelected =
              selectedCRates.includes(cRate) &&
              selectedTemperatures.includes(temperature);

            return (
              <tr
                key={index}
                className={`cursor-pointer ${
                  isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleRowClick(cRate, temperature)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {cRate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {temperature}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {result.metrics['Capacity [Ah]'].toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {result.metrics['Energy [Wh]'].toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
