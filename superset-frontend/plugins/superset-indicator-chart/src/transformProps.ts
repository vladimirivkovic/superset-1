import { ChartProps, DataRecord, getNumberFormatter } from '@superset-ui/core';
import { getColorFormatters2 } from '@superset-ui/chart-controls';

function insertMetricsIntoMarkdown(
  markdownTemplate: string,
  dataRecord: DataRecord,
  numberFormat: string,
  ignore: string[] = [],
) {
  const numberFormatter = getNumberFormatter(numberFormat);
  let markdown = markdownTemplate.slice(0);
  const regexp = /({{(.*?)}})/g;
  const matches = [...markdown.matchAll(regexp)];

  matches.forEach((match: any) => {
    const metricLabel = match[2];
    let metric = dataRecord[metricLabel];
    if (typeof metric !== 'undefined') {
      if (typeof metric === 'number' && !ignore.includes(metricLabel)) {
        metric = numberFormatter(metric);
      }
      markdown = markdown.replace(match[1], String(metric));
    }
  });

  return markdown;
}

export default function transformProps(chartProps: ChartProps) {
  const { width, height, formData, queriesData } = chartProps;
  const {
    groupby,
    textColor,
    markdown,
    orientation,
    numberFormat,
    roundedCorners,
    conditionalFormatting,
  } = formData;
  const data = (queriesData[0]?.data || []) as DataRecord[];

  const backgroundColors = data.map(_ => '#FFFFFF');

  const metricColorFormatters = getColorFormatters2(
    conditionalFormatting,
    data,
  );

  metricColorFormatters.forEach((formatter: any) => {
    const { column, getColorFromValue } = formatter;
    data.forEach((datum, index) => {
      const value = datum[column];
      const color = getColorFromValue(value);
      backgroundColors[index] = color ?? backgroundColors[index];
    });
  });

  const markdowns = data.map(dataRecord =>
    insertMetricsIntoMarkdown(markdown, dataRecord, numberFormat, groupby),
  );

  const transformedProps = {
    markdowns,
    backgroundColors,
    textColor,
    orientation,
    roundedCorners,
  };

  console.log(4, formData);
  console.log(5, queriesData);
  console.log(6, transformedProps);

  return {
    width,
    height,
    ...transformedProps,
  };
}
