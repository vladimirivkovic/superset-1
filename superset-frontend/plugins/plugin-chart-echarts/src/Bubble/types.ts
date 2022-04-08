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
  QueryFormColumn,
  QueryFormData,
  QueryFormMetric,
  SetDataMaskHook,
} from '@superset-ui/core';
import {
  DEFAULT_LEGEND_FORM_DATA,
  EchartsLegendFormData,
  LabelPositionEnum,
  LegendOrientation,
  LegendType,
} from '../types';
import { ColorBy } from 'echarts/types/src/util/types';

export type EchartsBubbleFormData = QueryFormData &
  EchartsLegendFormData & {
    colorScheme?: string;
    x: QueryFormColumn;
    y: QueryFormColumn;
    size: QueryFormMetric;
    labelLine: boolean;
    labelType: EchartsBubbleLabelType;
    labelsOutside: boolean;
    outerRadius: number;
    showLabels: boolean;
    numberFormat: string;
    dateFormat: string;
    showLabelsThreshold: number;
    emitFilter: boolean;
    animate: boolean;
    labelPositionX: string | undefined;
    labelPositionY: string | undefined;
    labelPosition: LabelPositionEnum;
    valuePosition: LabelPositionEnum;
    xAxisLabel?: string;
    xAxisLabelLocation?: string;
    xAxisLabelPadding?: number;
    yAxisLabel?: string;
    yAxisLabelLocation?: string;
    yAxisLabelPadding?: number;
    tooltipStyle: string;
    tooltipFormatter: string;
    splitLineX: boolean;
    splitLineY: boolean;
    scaleX: boolean;
    scaleY: boolean;
    bubbleSizeScale: number;
    colorBy: ColorBy;
  };

export enum EchartsBubbleLabelType {
  Key = 'key',
  Value = 'value',
  Percent = 'percent',
  KeyValue = 'key_value',
  KeyPercent = 'key_percent',
  KeyValuePercent = 'key_value_percent',
}

export interface EchartsBubbleChartProps extends ChartProps {
  formData: EchartsBubbleFormData;
  queriesData: ChartDataResponseResult[];
}

// @ts-ignore
export const DEFAULT_FORM_DATA: EchartsBubbleFormData = {
  ...DEFAULT_LEGEND_FORM_DATA,
  donut: false,
  innerRadius: 30,
  labelLine: false,
  labelType: EchartsBubbleLabelType.Key,
  legendOrientation: LegendOrientation.Top,
  legendType: LegendType.Scroll,
  numberFormat: 'SMART_NUMBER',
  outerRadius: 70,
  showLabels: true,
  labelsOutside: true,
  labelPosition: LabelPositionEnum.Right,
  valuePosition: LabelPositionEnum.Inside,
  showLabelsThreshold: 5,
  emitFilter: false,
  dateFormat: 'smart_date',
  tooltipFormatter: '',
  tooltipStyle: 'axis',
  splitLineX: false,
  splitLineY: false,
  scaleX: true,
  scaleY: true,
  bubbleSizeScale: 1,
  colorBy: 'series',
};

export interface BubbleChartTransformedProps {
  formData: EchartsBubbleFormData;
  height: number;
  width: number;
  echartOptions: EChartsCoreOption;
  emitFilter: boolean;
  setDataMask: SetDataMaskHook;
  labelMap: Record<string, DataRecordValue[]>;
  entity: QueryFormColumn;
  selectedValues: Record<number, string>;
}

export const TOOLTIP_STYLES: [string, string][] = [
  ['axis', 'axis'],
  ['item', 'item'],
];

export const COLOR_TYPES: [string, string][] = [
  ['series', 'series'],
  ['data', 'data'],
];
