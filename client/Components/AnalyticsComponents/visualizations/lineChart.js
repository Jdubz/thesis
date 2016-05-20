import d3 from 'd3';
import parse from './timeParse.js';

module.exports = () => {
  let width = window.innerWidth;
  const height = window.innerHeight - 100;

  const svg = d3.select('#d3container').append('svg')
    .attr('width', width)
    .attr('height', height);

  const colors = {
    anger: '#DC143C',
    sadness: '#4169E1',
    fear: '#FFD700',
    disgust: '#7CFC00',
    joy: '#DA70D6',
  };

  const update = (chartData) => {
    const nodes = svg.selectAll('.bubble')
        .data(chartData.nodes);

    const lines = svg.selectAll('.link')
        .data(chartData.lines);

    const labels = svg.selectAll('.label')
        .data(chartData.labels);

    nodes.transition().duration(500)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

    lines.transition().duration(500)
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

    nodes.enter().append('circle')
        .attr('class', 'bubble')
        .style('position', 'absolute')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 2)
        .style('fill', d => colors[d.type]);

    lines.enter().append('line')
        .attr('class', 'link')
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
        .style('stroke', d => colors[d.source.type])
        .style('stroke-width', '3')
        .style('stroke-opacity', '1');

    labels.enter().append('text')
        .attr('class', 'label')
        .attr('x', d => d.x)
        .attr('y', 400)
        .style('font-family', 'Arial')
        .style('text-anchor', 'middle')
        .style('fill', 'black')
        .style('font-weight', 'bold')
        .text(d => d.name);

    nodes.exit().remove();
    lines.exit().remove();
    labels.exit().remove();
  };

  return {
    update: (Emotions) => {
      update(parse(Emotions));
    },
    resize: () => {
      width = window.innerWidth;
    },
  };
};
