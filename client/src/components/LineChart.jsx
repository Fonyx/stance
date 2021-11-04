import React, {useEffect, useRef} from 'react'
import {select} from 'd3';

export default function LineChart({transactions}) {

    const svgDivContainer = useRef();
    const svgRef = useRef();

    const reDrawChart = () => {
        const svg = select(svgRef.current);

        svg.selectAll('rect').remove();

        // add data to the svg using d3
        let blocks = svg.selectAll('rect')
            .data(transactions)
            .enter()
            .append('g')
            .attr('transform', (d) => "translate(10,80)")

        blocks.append('circle')
            .attr('r', (d, i) => 10)
            .attr('fill', 'orange')
            .attr('cx', (d, i) => (i+1)*40)
            .attr('cy', (d, i) => (i+1)*25)
        
        blocks.append('text')
            .attr('dx', (d, i) => (i+1)*40)
            .attr('dy', (d, i) => (i+1)*25)
            .text((d) => d.description)

    }

    console.log('transactions are: ', transactions)

    useEffect(() => {
        reDrawChart();
    },[]);

    return (
        <React.Fragment>
            <div ref={svgDivContainer}>
                <svg
                    className="d3-chart"
                    width={800}
                    height={500}
                    ref={svgRef}
                />
            </div>
        </React.Fragment>
    );
}
