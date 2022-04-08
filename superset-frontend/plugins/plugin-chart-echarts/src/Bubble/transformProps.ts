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
import { toNumber } from 'lodash';
import {
  CategoricalColorNamespace,
  DataRecordValue,
  getColumnLabel,
  getMetricLabel,
  getNumberFormatter,
  getTimeFormatter,
} from '@superset-ui/core';
import { ZRColor } from 'echarts/types/src/util/types';
import { EChartsCoreOption, ScatterSeriesOption } from 'echarts';
import {
  DEFAULT_FORM_DATA as DEFAULT_Bar_FORM_DATA,
  EchartsBubbleChartProps,
  EchartsBubbleFormData,
  BubbleChartTransformedProps,
} from './types';
import { DEFAULT_LEGEND_FORM_DATA } from '../types';
import { extractGroupbyLabel, getColtypesMapping } from '../utils/series';
import { defaultGrid } from '../defaults';

export default function transformProps(
  chartProps: EchartsBubbleChartProps,
): BubbleChartTransformedProps {
  console.log(chartProps);
  const { formData, height, hooks, filterState, queriesData, width } =
    chartProps;
  const { data = [] } = queriesData[0];
  const coltypeMapping = getColtypesMapping(queriesData[0]);

  const {
    colorScheme,
    colorBy,
    entity,
    x,
    y,
    size,
    labelLine,
    dateFormat,
    numberFormat,
    emitFilter,
    labelPositionX,
    labelPositionY,
    labelPosition,
    xAxisLabel,
    xAxisLabelLocation,
    xAxisLabelPadding,
    yAxisLabel,
    yAxisLabelLocation,
    yAxisLabelPadding,
    tooltipStyle,
    splitLineX,
    splitLineY,
    scaleX,
    scaleY,
    bubbleSizeScale,
  }: EchartsBubbleFormData = {
    ...DEFAULT_LEGEND_FORM_DATA,
    ...DEFAULT_Bar_FORM_DATA,
    ...formData,
  };
  const entityLabel = getColumnLabel(entity);
  const xLabel = getColumnLabel(x);
  const yLabel = getColumnLabel(y);
  const sizeLabel = getMetricLabel(size);

  const groupbyLabels = [entity].map(getColumnLabel);

  const labelMap = data.reduce(
    (acc: Record<string, DataRecordValue[]>, datum) => {
      const label = extractGroupbyLabel({
        datum,
        groupby: groupbyLabels,
        coltypeMapping,
        timeFormatter: getTimeFormatter(dateFormat),
      });
      return {
        ...acc,
        [label]: groupbyLabels.map(col => datum[col]),
      };
    },
    {},
  );

  const { setDataMask = () => {} } = hooks;

  const colorFn = CategoricalColorNamespace.getScale(colorScheme as string);
  const numberFormatter = getNumberFormatter(numberFormat);
  const colors: ZRColor[] = data.map(datum => colorFn(`${datum[entity]}`));

  const transformedData: any = data.map(datum => [
    datum[xLabel],
    datum[yLabel],
    datum[sizeLabel],
    datum[entity],
  ]);

  console.log(transformedData);

  const series: ScatterSeriesOption[] = [
    {
      type: 'scatter',
      symbolSize: data => data[2] * bubbleSizeScale,
      colorBy,
      label: {
        show: true,
        formatter: param => param.data[3],
        position: labelPosition,
        minMargin: 2,
      },
      labelLayout: {
        x: labelPositionX ? `${labelPositionX}%` : undefined,
        y: labelPositionY ? `${labelPositionY}%` : undefined,
        moveOverlap: labelPositionX ? 'shiftY' : 'shiftX',
      },
      labelLine: {
        show: labelLine,
        length2: 5,
        lineStyle: {
          color: '#bbb',
        },
      },
      tooltip: {
        formatter: params => {
          const entity = `${entityLabel}: ${params.data[3]}`;
          const size = `${sizeLabel}: ${numberFormatter(params.data[2])}`;
          const x = `${xLabel}: ${numberFormatter(params.data[0])}`;
          const y = `${yLabel}: ${numberFormatter(params.data[1])}`;
          return `${entity}<br />${size}<br />${x}<br />${y}`;
        },
      },
      animation: true,
      emphasis: {
        focus: 'self',
      },
      name: entityLabel,
      data: transformedData,
      color: colors,
    },
  ];

  const selectedValues = (filterState.selectedValues || []).reduce(
    (acc: Record<string, number>, selectedValue: string) => {
      const index = series.findIndex(({ name }) => name === selectedValue);
      return {
        ...acc,
        [index]: selectedValue,
      };
    },
    {},
  );

  const echartOptions: EChartsCoreOption = {
    grid: {
      ...defaultGrid,
    },
    xAxis: {
      splitLine: { show: splitLineX },
      scale: scaleX,
      name: xAxisLabel,
      nameLocation: xAxisLabelLocation,
      nameTextStyle: {
        padding:
          10 +
          (xAxisLabelPadding !== undefined ? toNumber(xAxisLabelPadding) : 0),
      },
    },
    yAxis: {
      splitLine: { show: splitLineY },
      scale: scaleY,
      name: yAxisLabel,
      nameLocation: yAxisLabelLocation,
      nameTextStyle: {
        padding:
          10 +
          (yAxisLabelPadding !== undefined ? toNumber(yAxisLabelPadding) : 0),
      },
    },
    tooltip: {
      show: true,
      trigger: tooltipStyle,
      // formatter: tooltipFormatter,
    },
    series,
  };

  return {
    formData,
    width,
    height,
    echartOptions,
    setDataMask,
    emitFilter,
    entity,
    selectedValues,
    labelMap,
  };
}
