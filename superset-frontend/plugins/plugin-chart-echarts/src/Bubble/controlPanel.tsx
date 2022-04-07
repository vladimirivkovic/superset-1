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
import { t, validateNumber } from '@superset-ui/core';
import {
  ControlPanelConfig,
  sections,
  sharedControls,
  emitFilterControl,
} from '@superset-ui/chart-controls';

import { COLOR_TYPES, DEFAULT_FORM_DATA, TOOLTIP_STYLES } from './types';
import { LABEL_POSITION } from '../constants';

const config: ControlPanelConfig = {
  controlPanelSections: [
    sections.legacyRegularTime,
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        // ['series'],
        ['entity'],
        ['x'],
        ['y'],
        ['adhoc_filters'],
        emitFilterControl,
        ['size'],
        ['limit', null],
      ],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        ['color_scheme'],
        [
          {
            name: 'colorBy',
            config: {
              type: 'SelectControl',
              freeForm: true,
              label: t('Color by'),
              description: t('The policy to take colors'),
              renderTrigger: true,
              choices: COLOR_TYPES,
              default: DEFAULT_FORM_DATA.colorBy,
            },
          },
        ],
        [
          {
            name: 'labelLine',
            config: {
              type: 'CheckboxControl',
              label: t('Show label line'),
              renderTrigger: true,
              default: true,
              description: t('Whether to display label line.'),
            },
          },
        ],
        [
          {
            name: 'labelPositionX',
            config: {
              type: 'TextControl',
              label: t('Label position X (%)'),
              renderTrigger: true,
              default: '90',
            },
          },
        ],
        [
          {
            name: 'labelPositionY',
            config: {
              type: 'TextControl',
              label: t('Label position Y (%)'),
              renderTrigger: true,
              default: '0',
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
        // [
        //   {
        //     name: 'tooltipFormatter',
        //     config: {
        //       type: 'TextControl',
        //       label: t('Tooltip value format'),
        //       description: t('Tooltip value format'),
        //       renderTrigger: true,
        //       default: DEFAULT_FORM_DATA.tooltipFormatter,
        //     },
        //   },
        // ],
        [
          {
            name: 'bubbleSizeScale',
            config: {
              type: 'TextControl',
              label: t('Bubble size'),
              description: t('Scale bubble size'),
              validators: [validateNumber],
              renderTrigger: true,
              default: DEFAULT_FORM_DATA.bubbleSizeScale,
            },
          },
        ],
        [<h1 className="section-header">{t('Labels')}</h1>],
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
              choices: LABEL_POSITION,
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
              choices: LABEL_POSITION,
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
  controlOverrides: {},
};

export default config;
