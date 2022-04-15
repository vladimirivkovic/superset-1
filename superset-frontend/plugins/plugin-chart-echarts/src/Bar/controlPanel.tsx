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
import React from 'react';
import {
  ChartDataResponseResult,
  GenericDataType,
  QueryFormMetric,
  t,
  validateNonEmpty,
  validateNumber,
} from '@superset-ui/core';
import {
  ControlPanelConfig,
  sections,
  sharedControls,
  emitFilterControl,
  ControlFormItemSpec,
} from '@superset-ui/chart-controls';

import { legendSection } from '../controls';
import { LABEL_LOCATIONS, TOOLTIP_STYLES, VALUE_FORMATS } from './types';
import { LABEL_POSITION } from '../constants';

const barMetricValueFormat: { name: string; config: ControlFormItemSpec } = {
  name: 'barMetricValueFormat',
  config: {
    controlType: 'Select',
    label: t('Format'),
    description: t('Value formatter'),
    options: VALUE_FORMATS,
    width: 240,
    debounceDelay: 300,
  },
};

const barMetricValueThreshold: { name: string; config: ControlFormItemSpec } = {
  name: 'barMetricValueThreshold',
  config: {
    controlType: 'InputNumber',
    label: t('Threshold'),
    description: t('Minimum threshold for showing labels'),
    defaultValue: 0,
    width: 240,
    debounceDelay: 300,
    validators: [validateNumber],
  },
};

const config: ControlPanelConfig = {
  controlPanelSections: [
    sections.legacyRegularTime,
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        ['groupby'],
        ['metrics'],
        ['adhoc_filters'],
        emitFilterControl,
        ['row_limit'],
        [
          {
            name: 'series_limit_metric',
            config: {
              ...sharedControls.series_limit_metric,
              description: t(
                'Metric used to define how the top series are sorted if a series or cell limit is present. ' +
                  'If undefined reverts to the first metric (where appropriate).',
              ),
            },
          },
        ],
        [
          {
            name: 'order_desc',
            config: {
              type: 'CheckboxControl',
              label: t('Sort Descending'),
              default: true,
              description: t('Whether to sort descending or ascending'),
            },
          },
        ],
        // [
        //   {
        //     name: 'animate',
        //     config: {
        //       default: true,
        //       type: 'CheckboxControl',
        //       label: t('Animate'),
        //       description: t(
        //         'Turn on animation for EChart transition.',
        //       ),
        //     },
        //   },
        // ]
      ],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        ['color_scheme'],
        [
          {
            name: 'vertical',
            config: {
              type: 'CheckboxControl',
              label: t('Use Vertical Bars'),
              renderTrigger: true,
              default: false,
              description: t('Whether to display vertical bars.'),
            },
          },
        ],
        [
          {
            name: 'stack',
            config: {
              type: 'CheckboxControl',
              label: t('Use Stacked Bars'),
              renderTrigger: true,
              default: true,
              description: t('Whether to display stacked bars.'),
            },
          },
        ],
        [
          {
            name: 'showValues',
            config: {
              type: 'CheckboxControl',
              label: t('Show values'),
              renderTrigger: true,
              default: true,
              description: t('Whether to display values.'),
            },
          },
        ],
        [
          {
            name: 'metricLabelConfig',
            config: {
              type: 'ColumnConfigControl',
              label: t('Customize metric labels'),
              description: t('Further customize how to format metric labels'),
              renderTrigger: true,
              configFormLayout: {
                [GenericDataType.NUMERIC]: [
                  [barMetricValueFormat],
                  [barMetricValueThreshold],
                ],
              },
              shouldMapStateToProps() {
                return true;
              },
              mapStateToProps(explore, _, chart) {
                const values =
                  (explore?.controls?.metrics?.value as QueryFormMetric[]) ??
                  [];
                const metricColumn = values.map(value => {
                  if (typeof value === 'string') {
                    return value;
                  }
                  return value.label;
                });
                return {
                  queryResponse: chart?.queriesResponse?.[0] as
                    | ChartDataResponseResult
                    | undefined,
                  appliedColumnNames: metricColumn,
                };
              },
            },
          },
        ],
        [
          {
            name: 'valuePosition',
            config: {
              type: 'SelectControl',
              freeForm: true,
              label: t('Value position'),
              renderTrigger: true,
              choices: LABEL_POSITION,
              default: 'inside',
            },
          },
          {
            name: 'valueRotation',
            config: {
              type: 'TextControl',
              label: t('Value rotation'),
              renderTrigger: true,
              isFloat: true,
              debounceDelay: 300,
              default: 0,
            },
          },
        ],
        [
          {
            name: 'tooltipStyle',
            config: {
              type: 'SelectControl',
              freeForm: true,
              label: t('Tooltip style'),
              renderTrigger: true,
              choices: TOOLTIP_STYLES,
              default: 'axis',
            },
          },
        ],
        ...legendSection.slice(0, -1),
        [<h1 className="section-header">{t('Axis Labels')}</h1>],
        [
          {
            name: 'x_axis_show',
            config: {
              type: 'CheckboxControl',
              label: t('Show X Axis'),
              renderTrigger: true,
              default: true,
            },
          },
        ],
        [
          {
            name: 'x_axis_value_rotation',
            config: {
              type: 'TextControl',
              label: t('X Axis Values Angle'),
              renderTrigger: true,
              isFloat: true,
              debounceDelay: 300,
              default: 0,
            },
          },
          {
            name: 'x_axis_value_max',
            config: {
              type: 'TextControl',
              label: t('X Axis Max Value'),
              renderTrigger: true,
              isFloat: true,
              debounceDelay: 300,
              default: 0,
            },
          },
        ],
        [
          {
            name: 'x_axis_label',
            config: {
              type: 'TextControl',
              label: t('X Axis Label'),
              renderTrigger: true,
              default: '',
            },
          },
        ],
        [
          {
            name: 'x_axis_label_location',
            config: {
              type: 'SelectControl',
              freeForm: true,
              label: t('X Axis Label Location'),
              renderTrigger: true,
              choices: LABEL_LOCATIONS,
              default: 'center',
            },
          },
        ],
        [
          {
            name: 'x_axis_label_padding',
            config: {
              type: 'TextControl',
              label: t('X Axis Label Padding'),
              renderTrigger: true,
              default: '',
            },
          },
        ],
        [
          {
            name: 'y_axis_show',
            config: {
              type: 'CheckboxControl',
              label: t('Show Y Axis'),
              renderTrigger: true,
              default: true,
            },
          },
        ],
        [
          {
            name: 'y_axis_value_rotation',
            config: {
              type: 'TextControl',
              label: t('Y Axis Values Angle'),
              renderTrigger: true,
              isFloat: true,
              debounceDelay: 300,
              default: 0,
            },
          },
          {
            name: 'y_axis_value_max',
            config: {
              type: 'TextControl',
              label: t('Y Axis Max Value'),
              renderTrigger: true,
              isFloat: true,
              debounceDelay: 300,
              default: 0,
            },
          },
        ],
        [
          {
            name: 'y_axis_label',
            config: {
              type: 'TextControl',
              label: t('Y Axis Label'),
              renderTrigger: true,
              default: '',
            },
          },
        ],
        [
          {
            name: 'y_axis_label_location',
            config: {
              type: 'SelectControl',
              freeForm: true,
              label: t('Y Axis Label Location'),
              renderTrigger: true,
              choices: LABEL_LOCATIONS,
              default: 'center',
            },
          },
        ],
        [
          {
            name: 'y_axis_label_padding',
            config: {
              type: 'TextControl',
              label: t('Y Axis Label Padding'),
              renderTrigger: true,
              default: '',
            },
          },
        ],
      ],
    },
  ],
  controlOverrides: {
    series: {
      validators: [validateNonEmpty],
      clearable: false,
    },
    row_limit: {
      default: 100,
    },
  },
};

export default config;
