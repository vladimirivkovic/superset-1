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
import {
  CategoricalColorNamespace,
  DataRecordValue,
  getColumnLabel,
  getMetricLabel,
  getTimeFormatter,
} from '@superset-ui/core';
import { ZRColor } from 'echarts/types/src/util/types';
import { EChartsCoreOption, SankeySeriesOption } from 'echarts';
import {
  DEFAULT_FORM_DATA as DEFAULT_Sankey_FORM_DATA,
  EchartsSankeyChartProps,
  EchartsSankeyFormData,
  SankeyChartTransformedProps,
} from './types';
import { DEFAULT_LEGEND_FORM_DATA } from '../types';
import { extractGroupbyLabel, getColtypesMapping } from '../utils/series';
import { defaultGrid } from '../defaults';

export default function transformProps(
  chartProps: EchartsSankeyChartProps,
): SankeyChartTransformedProps {
  const { formData, height, hooks, filterState, queriesData, width } =
    chartProps;
  const { data = [] } = queriesData[0];
  const coltypeMapping = getColtypesMapping(queriesData[0]);

  const {
    colorScheme,
    groupby,
    metric,
    dateFormat,
    emitFilter,
    tooltipFormatter,
    draggable,
    silent,
    nodeWidth,
    nodeGap,
    nodeAlign,
    orient,
    showLabels,
    labelPosition,
    labelAlign,
    curveness,
    lineStyleColor,
  }: EchartsSankeyFormData = {
    ...DEFAULT_LEGEND_FORM_DATA,
    ...DEFAULT_Sankey_FORM_DATA,
    ...formData,
  };
  const metricLabel = getMetricLabel(metric);
  const groupbyLabels = groupby.map(getColumnLabel);
  const sourceLabel = groupbyLabels[0];
  const targetLabel = groupbyLabels[1];

  const sourceKeys = data.map(datum =>
    extractGroupbyLabel({
      datum,
      groupby: [sourceLabel],
      coltypeMapping,
      timeFormatter: getTimeFormatter(dateFormat),
    }),
  );
  const sourceKeysSet = [...new Set(sourceKeys)];

  const targetKeys = data.map(datum =>
    extractGroupbyLabel({
      datum,
      groupby: [targetLabel],
      coltypeMapping,
      timeFormatter: getTimeFormatter(dateFormat),
    }),
  );
  const targetKeysSet = [...new Set(targetKeys)];

  const keys = sourceKeysSet.concat(targetKeysSet);

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

  const transformedData = keys.map(key => ({
    name: key,
  }));

  const links = data.map(datum => ({
    source: String(datum[sourceLabel]),
    target: String(datum[targetLabel]),
    value: Number(datum[metricLabel]),
  }));

  const colors: ZRColor[] = links.map(link =>
    colorFn(`${link.source}_${link.target}`),
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

  const series: SankeySeriesOption[] = [
    {
      type: 'sankey',
      draggable,
      nodeWidth,
      nodeGap,
      nodeAlign,
      orient,
      silent,
      label: {
        show: showLabels,
        position: labelPosition,
        align: labelAlign,
      },
      animation: true,
      emphasis: {
        focus: 'adjacency',
      },
      name: metricLabel,
      data: transformedData,
      links,
      universalTransition: {
        enabled: true,
      },
      lineStyle: {
        color: lineStyleColor,
        curveness,
      },
    },
  ];

  const echartOptions: EChartsCoreOption = {
    grid: {
      ...defaultGrid,
    },
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
      formatter: tooltipFormatter,
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
