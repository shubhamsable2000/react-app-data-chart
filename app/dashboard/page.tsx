// DashboardPage.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { AppSidebar } from '../component/app-sidebar';
import ResultTable from '../component/resultTable';
import BatteryChart from '../component/batteryChart';
import MultiSelect from '../component/MultiSelect';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import resultsData from '../../public/results.json';

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

export function DashboardPage() {
  // State variables for filters
  const [selectedCRates, setSelectedCRates] = useState<number[]>([]);
  const [selectedTemperatures, setSelectedTemperatures] = useState<number[]>(
    []
  );
  const [xVariable, setXVariable] = useState<string>('Capacity [A.h]');
  const [yVariable, setYVariable] = useState<string>('Voltage [V]');

  const [uniqueCRates, setUniqueCRates] = useState<number[]>([]);
  const [uniqueTemperatures, setUniqueTemperatures] = useState<number[]>([]);
  const [availableXVariables, setAvailableXVariables] = useState<string[]>([]);
  const [availableYVariables, setAvailableYVariables] = useState<string[]>([]);

  useEffect(() => {
    // Extract unique C-rates and Temperatures from results
    const cRatesSet = new Set<number>();
    const temperaturesSet = new Set<number>();
    const varsSet = new Set<string>();

    const results = resultsData as ResultType[];

    results.forEach((result) => {
      cRatesSet.add(result.parameters['C-rate']);
      temperaturesSet.add(result.parameters['Temperature [°C]']);

      // Collect available variables from outputs, metrics, and parameters
      Object.keys(result.outputs).forEach((key) => varsSet.add(key));
      Object.keys(result.metrics).forEach((key) => varsSet.add(key));
      Object.keys(result.parameters).forEach((key) => varsSet.add(key));
    });

    setUniqueCRates(Array.from(cRatesSet).sort((a, b) => a - b));
    setUniqueTemperatures(Array.from(temperaturesSet).sort((a, b) => a - b));

    const variablesArray = Array.from(varsSet);
    setAvailableXVariables(variablesArray);
    setAvailableYVariables(variablesArray);
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 ">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* Filters */}
          <div className="rounded-xl bg-[#30343B] p-4">
            <h2 className="text-xl font-bold text-white">Filters</h2>
            <div className="flex flex-col md:flex-row gap-4">
              {/* C-rate Filter */}
              <div className="flex-1">
                <label className="text-white">C-rate</label>
                <MultiSelect
                  options={uniqueCRates}
                  selectedOptions={selectedCRates}
                  onChange={setSelectedCRates}
                />
              </div>
              {/* Temperature Filter */}
              <div className="flex-1">
                <label className="text-white">Temperature [°C]</label>
                <MultiSelect
                  options={uniqueTemperatures}
                  selectedOptions={selectedTemperatures}
                  onChange={setSelectedTemperatures}
                />
              </div>
              {/* Variables Selection */}
              <div className="flex-1">
                <label className="text-white">X Variable</label>
                <select
                  value={xVariable}
                  onChange={(e) => setXVariable(e.target.value)}
                  className="w-full mt-1 p-2 rounded"
                >
                  {availableXVariables.map((variable) => (
                    <option key={variable} value={variable}>
                      {variable}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-white">Y Variable</label>
                <select
                  value={yVariable}
                  onChange={(e) => setYVariable(e.target.value)}
                  className="w-full mt-1 p-2 rounded"
                >
                  {availableYVariables.map((variable) => (
                    <option key={variable} value={variable}>
                      {variable}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-[#30343B] md:min-h-min">
            <h1 className="text-2xl font-bold text-white">Battery Chart</h1>
            <BatteryChart
              selectedCRates={selectedCRates}
              selectedTemperatures={selectedTemperatures}
              xVariable={xVariable}
              yVariable={yVariable}
            />
          </div>
          <div className="rounded-xl bg-[#30343B] md:min-h-min">
            <h1 className="text-2xl font-bold text-white">Results Table</h1>
            <ResultTable
              selectedCRates={selectedCRates}
              selectedTemperatures={selectedTemperatures}
              setSelectedCRates={setSelectedCRates}
              setSelectedTemperatures={setSelectedTemperatures}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
