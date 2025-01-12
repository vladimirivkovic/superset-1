/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { EChartsCoreOption } from 'echarts';
import {
  ChartDataResponseResult,
  ChartProps,
  DataRecordValue,
  NumberFormats,
  QueryFormColumn,
  QueryFormData,
  QueryFormMetric,
  SetDataMaskHook,
} from '@superset-ui/core';
import {
  DEFAULT_LEGEND_FORM_DATA,
  EchartsLegendFormData,
  EchartTransition,
  LabelPositionEnum,
  LegendOrientation,
  LegendType,
} from '../types';

export type EchartsBarFormData = QueryFormData &
  EchartsLegendFormData & {
    colorScheme?: string;
    currentOwnValue?: string[] | null;
    donut: boolean;
    defaultValue?: string[] | null;
    groupby: QueryFormColumn[];
    innerRadius: number;
    labelLine: boolean;
    labelType: EchartsBarLabelType;
    labelsOutside: boolean;
    metrics: QueryFormMetric[];
    outerRadius: number;
    showLabels: boolean;
    numberFormat: string;
    dateFormat: string;
    showLabelsThreshold: number;
    emitFilter: boolean;
    animate: boolean;
    vertical: boolean;
    stack: boolean;
    showValues: boolean;
    valuePosition: LabelPositionEnum;
    xAxisLabel?: string;
    xAxisLabelLocation?: string;
    xAxisLabelPadding?: number;
    yAxisLabel?: string;
    yAxisLabelLocation?: string;
    yAxisLabelPadding?: number;
    tooltipStyle: string;
    valueFormat: string;
  };

export enum EchartsBarLabelType {
  Key = 'key',
  Value = 'value',
  Percent = 'percent',
  KeyValue = 'key_value',
  KeyPercent = 'key_percent',
  KeyValuePercent = 'key_value_percent',
}

export interface EchartsBarChartProps extends ChartProps {
  formData: EchartsBarFormData;
  queriesData: ChartDataResponseResult[];
}

// @ts-ignore
export const DEFAULT_FORM_DATA: EchartsBarFormData = {
  ...DEFAULT_LEGEND_FORM_DATA,
  donut: false,
  groupby: [],
  innerRadius: 30,
  labelLine: false,
  labelType: EchartsBarLabelType.Key,
  legendOrientation: LegendOrientation.Top,
  legendType: LegendType.Scroll,
  numberFormat: 'SMART_NUMBER',
  outerRadius: 70,
  showLabels: true,
  labelsOutside: true,
  valuePosition: LabelPositionEnum.Inside,
  showLabelsThreshold: 5,
  emitFilter: false,
  dateFormat: 'smart_date',
  tooltipStyle: 'axis',
  valueFormat: NumberFormats.SMART_NUMBER,
};

export interface BarChartTransformedProps {
  formData: EchartsBarFormData;
  height: number;
  width: number;
  echartOptions: EChartsCoreOption;
  emitFilter: boolean;
  setDataMask: SetDataMaskHook;
  labelMap: Record<string, DataRecordValue[]>;
  groupby: QueryFormColumn[];
  selectedValues: Record<number, string>;
  transition?: EchartTransition;
}

export const LABEL_LOCATIONS: [string, string][] = [
  ['start', 'start'],
  ['center', 'center'],
  ['end', 'end'],
];

export const TOOLTIP_STYLES: [string, string][] = [
  ['axis', 'axis'],
  ['item', 'item'],
];

export const VALUE_FORMATS: [string, string][] = [
  [NumberFormats.SMART_NUMBER, 'smart number'],
  [NumberFormats.PERCENT, 'percent'],
  [NumberFormats.PERCENT_0_POINT, 'percent rounded'],
];
