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
import { t, validateInteger, validateNonEmpty } from '@superset-ui/core';
import { ControlPanelConfig, sections } from '@superset-ui/chart-controls';
import {
  DEFAULT_FORM_DATA,
  LINE_STYLE_COLORS,
  NODE_ALIGN_VALUES,
  ORIENT_VALUES,
} from './types';
import { LABEL_POSITION } from '../constants';

const config: ControlPanelConfig = {
  controlPanelSections: [
    sections.legacyRegularTime,
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'groupby',
            override: {
              label: t('Source / Target'),
              description: t('Choose a source and a target'),
            },
          },
        ],
        ['metric'],
        ['adhoc_filters'],
        [
          {
            name: 'row_limit',
            override: {
              description: t(
                'Limiting rows may result in incomplete data and misleading charts. Consider filtering or grouping source/target names instead.',
              ),
            },
          },
        ],
        [
          {
            name: 'sort_by_metric',
            config: {
              type: 'CheckboxControl',
              label: t('Sort by metric'),
              description: t(
                'Whether to sort results by the selected metric in descending order.',
              ),
            },
          },
        ],
      ],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        ['color_scheme'],
        [<h1 className="section-header">{t('Node options')}</h1>],
        [
          {
            name: 'draggable',
            config: {
              type: 'CheckboxControl',
              label: t('Draggable'),
              renderTrigger: true,
              default: true,
            },
          },
          {
            name: 'silent',
            config: {
              type: 'CheckboxControl',
              label: t('Silent'),
              renderTrigger: true,
              default: false,
            },
          },
        ],
        [
          {
            name: 'nodeWidth',
            config: {
              type: 'TextControl',
              isInt: true,
              default: DEFAULT_FORM_DATA.nodeWidth,
              validators: [validateNonEmpty, validateInteger],
              renderTrigger: true,
              label: t('Node width'),
            },
          },
          {
            name: 'nodeGap',
            config: {
              type: 'TextControl',
              isInt: true,
              default: DEFAULT_FORM_DATA.nodeGap,
              validators: [validateNonEmpty, validateInteger],
              renderTrigger: true,
              label: t('Node gap'),
            },
          },
        ],
        [
          {
            name: 'nodeAlign',
            config: {
              type: 'SelectControl',
              label: t('Node align'),
              renderTrigger: true,
              default: DEFAULT_FORM_DATA.nodeAlign,
              choices: NODE_ALIGN_VALUES,
            },
          },
          {
            name: 'orient',
            config: {
              type: 'SelectControl',
              label: t('Orientation'),
              renderTrigger: true,
              default: DEFAULT_FORM_DATA.orient,
              choices: ORIENT_VALUES,
            },
          },
        ],
        [<h1 className="section-header">{t('Label options')}</h1>],
        [
          {
            name: 'showLabels',
            config: {
              type: 'CheckboxControl',
              label: t('Show labels'),
              renderTrigger: true,
              default: true,
              description: t('Whether to display node labels.'),
            },
          },
        ],
        [
          {
            name: 'labelPosition',
            config: {
              type: 'SelectControl',
              freeForm: true,
              label: t('Label position'),
              renderTrigger: true,
              choices: LABEL_POSITION,
              default: 'right',
            },
          },
          {
            name: 'labelAlign',
            config: {
              type: 'SelectControl',
              freeForm: true,
              label: t('Label align'),
              renderTrigger: true,
              default: DEFAULT_FORM_DATA.nodeAlign,
              choices: NODE_ALIGN_VALUES,
            },
          },
        ],
        [<h1 className="section-header">{t('Tooltip options')}</h1>],
        [
          {
            name: 'tooltipFormatter',
            config: {
              type: 'TextControl',
              label: t('Tooltip formatter'),
              renderTrigger: true,
              default: '',
            },
          },
        ],
        [<h1 className="section-header">{t('Line options')}</h1>],
        [
          {
            name: 'curveness',
            config: {
              type: 'SliderControl',
              label: t('Curveness'),
              description: t('Line curveness'),
              renderTrigger: true,
              min: 0,
              max: 1,
              step: 0.1,
              default: 0.5,
            },
          },
        ],
        [
          {
            name: 'lineStyleColor',
            config: {
              type: 'SelectControl',
              freeForm: true,
              label: t('Line style color'),
              renderTrigger: true,
              default: DEFAULT_FORM_DATA.lineStyleColor,
              choices: LINE_STYLE_COLORS,
            },
          },
        ],
      ],
    },
  ],
};

export default config;
