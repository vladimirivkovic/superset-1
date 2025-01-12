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
  NumberFormats,
  NumberFormatter,
} from '@superset-ui/core';
import { CallbackDataParams, ZRColor } from 'echarts/types/src/util/types';
import { EChartsCoreOption, BarSeriesOption } from 'echarts';
import {
  DEFAULT_FORM_DATA as DEFAULT_Bar_FORM_DATA,
  EchartsBarChartProps,
  EchartsBarFormData,
  EchartsBarLabelType,
  BarChartTransformedProps,
} from './types';
import { DEFAULT_LEGEND_FORM_DATA } from '../types';
import {
  extractGroupbyLabel,
  getChartPadding,
  getColtypesMapping,
  getLegendProps,
  sanitizeHtml,
} from '../utils/series';
import { defaultGrid } from '../defaults';
import { OpacityEnum } from '../constants';

const percentFormatter = getNumberFormatter(NumberFormats.PERCENT_2_POINT);

export function formatBarLabel({
  params,
  labelType,
  numberFormatter,
  sanitizeName = false,
}: {
  params: Pick<CallbackDataParams, 'name' | 'value' | 'percent'>;
  labelType: EchartsBarLabelType;
  numberFormatter: NumberFormatter;
  sanitizeName?: boolean;
}): string {
  const { name: rawName = '', value, percent } = params;
  const name = sanitizeName ? sanitizeHtml(rawName) : rawName;
  const formattedValue = numberFormatter(value as number);
  const formattedPercent = percentFormatter((percent as number) / 100);

  switch (labelType) {
    case EchartsBarLabelType.Key:
      return name;
    case EchartsBarLabelType.Value:
      return formattedValue;
    case EchartsBarLabelType.Percent:
      return formattedPercent;
    case EchartsBarLabelType.KeyValue:
      return `${name}: ${formattedValue}`;
    case EchartsBarLabelType.KeyValuePercent:
      return `${name}: ${formattedValue} (${formattedPercent})`;
    case EchartsBarLabelType.KeyPercent:
      return `${name}: ${formattedPercent}`;
    default:
      return name;
  }
}

export default function transformProps(
  chartProps: EchartsBarChartProps,
): BarChartTransformedProps {
  const { formData, height, hooks, filterState, queriesData, width } =
    chartProps;
  const { data = [] } = queriesData[0];
  const coltypeMapping = getColtypesMapping(queriesData[0]);

  const {
    colorScheme,
    groupby,
    labelsOutside,
    labelLine,
    legendOrientation,
    legendType,
    legendMargin,
    showLegend,
    metrics,
    dateFormat,
    emitFilter,
    vertical,
    stack,
    showValues,
    valuePosition,
    valueRotation,
    xAxisShow,
    xAxisValueRotation,
    xAxisValueMax,
    xAxisLabel,
    xAxisLabelLocation,
    xAxisLabelPadding,
    yAxisShow,
    yAxisValueRotation,
    yAxisValueMax,
    yAxisLabel,
    yAxisLabelLocation,
    yAxisLabelPadding,
    tooltipStyle,
    metricLabelConfig,
  }: EchartsBarFormData = {
    ...DEFAULT_LEGEND_FORM_DATA,
    ...DEFAULT_Bar_FORM_DATA,
    ...formData,
  };
  const metricLabels = metrics.map(m => getMetricLabel(m));
  const groupbyLabels = groupby.map(getColumnLabel);
  const valueFormatter = getNumberFormatter(NumberFormats.SMART_NUMBER);

  const sumByMetric = metricLabels
    .map(metricLabel => ({
      metricLabel,
      sum: data
        .map(datum => datum[metricLabel])
        .reduce((a, b) => toNumber(a) + toNumber(b), 0),
    }))
    .reduce(
      (obj, item) => Object.assign(obj, { [item.metricLabel]: item.sum }),
      {},
    );

  const keys = data.map(datum =>
    extractGroupbyLabel({
      datum,
      groupby: groupbyLabels,
      coltypeMapping,
      timeFormatter: getTimeFormatter(dateFormat),
    }),
  );
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
  const colors: ZRColor[] =
    metricLabels.length > 1
      ? metricLabels.map(metricLabel => colorFn(metricLabel))
      : data.map(datum =>
          colorFn(
            extractGroupbyLabel({
              datum,
              groupby: groupbyLabels,
              coltypeMapping,
              timeFormatter: getTimeFormatter(dateFormat),
            }),
          ),
        );

  function getTransformedDataForMetric(metricLabel: string): BarSeriesOption[] {
    return data.map(datum => {
      const name = extractGroupbyLabel({
        datum,
        groupby: groupbyLabels,
        coltypeMapping,
        timeFormatter: getTimeFormatter(dateFormat),
      });

      const isFiltered =
        filterState.selectedValues &&
        !filterState.selectedValues.includes(name);

      return {
        value: datum[metricLabel],
        name,
        itemStyle: {
          opacity: isFiltered
            ? OpacityEnum.SemiTransparent
            : OpacityEnum.NonTransparent,
        },
      };
    });
  }

  const transformedData: BarSeriesOption[] = getTransformedDataForMetric(
    metricLabels[0],
  );

  const selectedValues = (filterState.selectedValues || []).reduce(
    (acc: Record<string, number>, selectedValue: string) => {
      const index = transformedData.findIndex(
        ({ name }) => name === selectedValue,
      );
      return {
        ...acc,
        [index]: selectedValue,
      };
    },
    {},
  );

  const metricValueFormatter = function (params: any) {
    const {
      data: { value },
    } = params;

    if (metricLabelConfig?.[params.seriesName]) {
      const { barMetricValueFormat, barMetricValueThreshold } =
        metricLabelConfig[params.seriesName];
      const barMetricValueFormatter = getNumberFormatter(barMetricValueFormat);
      const threshold = barMetricValueThreshold ?? 0;

      if (barMetricValueFormat?.includes('%')) {
        const displayValue = value / sumByMetric[params.seriesName];
        return displayValue * 100 > threshold
          ? barMetricValueFormatter(displayValue)
          : '';
      }

      return value > threshold ? barMetricValueFormatter(value) : '';
    }

    return valueFormatter(value);
  };

  const series: BarSeriesOption[] = metrics.map(m => {
    const metricLabel = getMetricLabel(m);
    return {
      type: 'bar',
      stack: stack ? 'total' : undefined,
      colorBy: metrics.length > 1 ? 'series' : 'data',
      label: {
        show: showValues,
        position: valuePosition,
        rotate: valueRotation,
        formatter: metricValueFormatter,
      },
      ...getChartPadding(showLegend, legendOrientation, legendMargin),
      animation: true,
      labelLine: labelsOutside && labelLine ? { show: true } : { show: false },
      emphasis: {
        focus: 'series',
      },
      name: metricLabel,
      data: getTransformedDataForMetric(metricLabel),
      universalTransition: {
        enabled: true,
      },
    };
  });

  console.log(xAxisValueMax);

  const echartOptions: EChartsCoreOption = {
    grid: {
      ...defaultGrid,
    },
    xAxis: {
      type: vertical ? 'category' : 'value',
      boundaryGap: vertical ? true : [0, 0.1],
      data: vertical ? keys : undefined,
      show: xAxisShow,
      axisLabel: {
        show: xAxisShow,
        rotate: xAxisValueRotation,
        interval: 0,
      },
      max: vertical ? null : toNumber(xAxisValueMax) ? xAxisValueMax : null,
      splitLine: false,
      name: xAxisLabel,
      nameLocation: xAxisLabelLocation,
      nameTextStyle: {
        padding:
          10 +
          (xAxisLabelPadding !== undefined ? toNumber(xAxisLabelPadding) : 0),
      },
    },
    yAxis: {
      type: vertical ? 'value' : 'category',
      boundaryGap: vertical ? [0, 0.1] : true,
      data: vertical ? undefined : keys,
      show: yAxisShow,
      axisLabel: {
        show: yAxisShow,
        rotate: yAxisValueRotation,
        interval: 0,
      },
      max: vertical ? (toNumber(yAxisValueMax) ? yAxisValueMax : null) : null,
      splitLine: false,
      name: yAxisLabel,
      nameLocation: yAxisLabelLocation,
      nameTextStyle: {
        padding:
          10 +
          (yAxisLabelPadding !== undefined ? toNumber(yAxisLabelPadding) : 0),
      },
    },
    tooltip: {
      trigger: tooltipStyle,
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      ...getLegendProps(legendType, legendOrientation, showLegend),
    },
    color: colors,
    series,
  };

  return {
    formData,
    width,
    height,
    echartOptions,
    setDataMask,
    emitFilter,
    labelMap,
    groupby,
    selectedValues,
  };
}
