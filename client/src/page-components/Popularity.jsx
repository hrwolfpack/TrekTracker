import React from 'react';
import { letterFrequency } from '@vx/mock-data';
import { Group } from '@vx/group';
import { Bar } from '@vx/shape';
import { scaleLinear, scaleBand } from '@vx/scale';

// We'll use some mock data from `@vx/mock-data` for this.
const data = letterFrequency;
// Define the graph dimensions and margins
const width = 500;
const height = 500;
const margin = { top: 20, bottom: 20, left: 20, right: 20 };

// Then we'll create some bounds
const xMax = width - margin.left - margin.right;
const yMax = height - margin.top - margin.bottom;

// We'll make some helpers to get at the data we want
const x = d => d.letter;
const y = d => +d.frequency * 100;

// And then scale the graph by our data
const xScale = scaleBand({
  rangeRound: [0, xMax],
  domain: data.map(x),
  padding: 0.4,
});
const yScale = scaleLinear({
  rangeRound: [yMax, 0],
  domain: [0, Math.max(...data.map(y))],
});

// Compose together the scale and accessor functions to get point functions
const compose = (scale, accessor) => (data) => scale(accessor(data));
const xPoint = compose(xScale, x);
const yPoint = compose(yScale, y);

// Finally we'll embed it all in an SVG
function BarGraph(props) {
  return (
    <svg width={width} height={height}>
      {data.map((d, i) => {
        const barHeight = yMax - yPoint(d);
        return (
          <Group key={`bar-${i}`}>
            <Bar
              x={xPoint(d)}
              y={yMax - barHeight}
              height={barHeight}
              width={xScale.bandwidth()}
              fill='#fc2e1c'
            />
          </Group>
        );
      })}
    </svg>
  );
}

export default BarGraph;
//Saving for testing purposes/experimenting with different graphs
// import React from 'react';
// import { Bar } from '@vx/shape';
// import { Group } from '@vx/group';
// import { GradientTealBlue } from '@vx/gradient';
// import { letterFrequency } from '@vx/mock-data';
// import { scaleBand, scaleLinear } from '@vx/scale';
// import { extent, max } from 'd3-array';
// import { AxisLeft, AxisBottom } from '@vx/axis';
//
// const data = letterFrequency.slice(5);
//
// function round(value, precision) {
//   var multiplier = Math.pow(10, precision || 0);
//   return Math.round(value * multiplier) / multiplier;
// }
//
// // accessors
// const x = d => d.letter;
// const y = d => +d.frequency * 100;
//
// export default ({
//   width,
//   height,
// }) => {
//   if (width < 10) return null;
//
//   // bounds
//   const xMax = width;
//   const yMax = height - 120;
//
//   // scales
//   const xScale = scaleBand({
//     rangeRound: [0, xMax],
//     domain: data.map(x),
//     padding: 0.4,
//   });
//   const yScale = scaleLinear({
//     rangeRound: [yMax, 0],
//     domain: [0, max(data, y)],
//   });
//
//   return (
//     <svg width={width} height={height}>
//       <GradientTealBlue id="teal" />
//       <rect
//         x={0}
//         y={0}
//         width={width}
//         height={height}
//         fill={`url(#teal)`}
//         rx={14}
//       />
//       <Group top={40}>
//         {data.map((d, i) => {
//           const barHeight = yMax - yScale(y(d));
//           return (
//             <Group key={`bar-${x(d)}`}>
//               <Bar
//                 width={xScale.bandwidth()}
//                 height={barHeight}
//                 x={xScale(x(d))}
//                 y={yMax - barHeight}
//                 fill="rgba(23, 233, 217, .5)"
//                 data={{ x: x(d), y: y(d) }}
//                 onClick={data => event => {
//                   alert(`clicked: ${JSON.stringify(data)}`)
//                 }}
//               />
//             </Group>
//           );
//         })}
//       </Group>
//     </svg>
//   );
// }
