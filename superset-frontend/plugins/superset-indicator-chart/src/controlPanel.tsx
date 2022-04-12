import { QueryFormMetric, t } from '@superset-ui/core';
import {
  ControlPanelConfig,
  formatSelectOptions,
  D3_FORMAT_OPTIONS,
} from '@superset-ui/chart-controls';
import { DEFAULT_FORM_DATA } from './constants';

const config: ControlPanelConfig = {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      tabOverride: 'data',
      controlSetRows: [
        ['groupby'],
        ['metrics'],
        ['adhoc_filters'],
        [
          {
            name: 'order_desc',
            config: {
              type: 'CheckboxControl',
              label: t('Sort descending'),
              default: DEFAULT_FORM_DATA.order_desc,
              description: t('Whether to sort descending or ascending'),
            },
          },
        ],
      ],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'markdown',
            config: {
              type: 'TextAreaControl',
              label: t('Markdown'),
              default: DEFAULT_FORM_DATA.markdown,
              language: 'markdown',
              offerEditInModal: true,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'text_color',
            config: {
              type: 'SelectControl',
              label: t('Text Color'),
              choices: formatSelectOptions(['light', 'dark']),
              default: DEFAULT_FORM_DATA.text_color,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'number_format',
            config: {
              type: 'SelectControl',
              label: t('Number format'),
              description: 'D3 format syntax: https://github.com/d3/d3-format',
              freeForm: true,
              renderTrigger: true,
              default: DEFAULT_FORM_DATA.number_format,
              choices: D3_FORMAT_OPTIONS,
            },
          },
        ],
        [
          {
            name: 'orientation',
            config: {
              type: 'SelectControl',
              label: t('Orientation'),
              description: 'How to align multiple indicators',
              choices: formatSelectOptions(['horizontal', 'vertical']),
              default: DEFAULT_FORM_DATA.orientation,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'rounded_corners',
            config: {
              type: 'CheckboxControl',
              label: t('Rounded Corners'),
              default: DEFAULT_FORM_DATA.rounded_corners,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'conditional_formatting',
            config: {
              type: 'ConditionalFormattingControl2',
              renderTrigger: true,
              label: t('Conditional formatting'),
              description: t('Apply conditional color formatting to metrics'),
              mapStateToProps(explore) {
                // const groupby = explore?.controls?.groupby?.value ?? [];
                // const groupbyColumn = groupby.map(value => ({
                //   value,
                //   label: value,
                // }));

                const values =
                  (explore?.controls?.metrics?.value as QueryFormMetric[]) ??
                  [];
                const verboseMap = explore?.datasource?.verbose_map ?? {};
                const metricColumn = values.map(value => {
                  if (typeof value === 'string') {
                    return { value, label: verboseMap[value] ?? value };
                  }
                  return { value: value.label, label: value.label };
                });

                const columnOptions = metricColumn;
                return {
                  columnOptions,
                  verboseMap,
                };
              },
            },
          },
        ],
      ],
    },
  ],
};

export default config;
