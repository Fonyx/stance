import React, {useEffect, useState, useRef} from 'react'
import {select, scaleTime, extent, axisBottom, scaleLinear, axisLeft, max, line, axisRight} from 'd3';

//https://www.d3-graph-gallery.com/graph/line_basic.html

function getWindowDimensions() {
    const { innerWidth: rawWidth, innerHeight: rawHeight } = window;
    let width = 0.4*rawWidth;
    let height = 0.4*rawHeight;
    if(width >= 600){
        width = 600;
    }
    if(height >= 400){
        width = 400;
    }
    return {
        width,
        height
    };
}

/**
 * Plots out a transaction stream, elements are structured [date, balance, [detailObjs]]
 * @param {[streamElementObj]} {date, balance, [trans names for day]} 
 * @returns 
 */
export default function LineChart({accumulatedData}) {

    const svgDivContainer = useRef();
    const svgRef = useRef();

    // const [dimensions, setDimensions] = useState(getWindowDimensions());

    // const dimensions = {width: window.innerWidth*0.8, height: window.innerHeight*0.5}

    const reDrawChart = () => {
        const svg = select(svgRef.current);

        svg.selectAll('path').remove();
        svg.selectAll('g').remove();

        let dimensions = {width: "600", height: "400"};

        if(!dimensions) return

        // set the dimensions and margins of the graph
        const margin = {top: 10, right: 30, bottom: 30, left: 60},
            width = dimensions.width - margin.left - margin.right,
            height = dimensions.height - margin.top - margin.bottom;

        // append the svg object to the body of the page
        svg.attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // When reading the csv, I must format variables:

        // Add X axis --> it is a date format
        const x = scaleTime()
        .domain(extent(accumulatedData, function(d) { return d.date; }))
        .range([ 0, width ]);

        svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(axisBottom(x));

        // Add Y axis
        const y = scaleLinear()
        .domain([0, max(accumulatedData, function(d) { return d.balance; })])
        .range([ height, 0 ]);
        
        svg.append("g")
        .call(axisLeft(y));

        // Add the line
        svg.append("path")
        .datum(accumulatedData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line()
            .x(function(d) { return x(d.date) })
            .y(function(d) { return y(d.balance) })
            )

    }

    reDrawChart();

    // useEffect(() => {

    //     function handleResize() {
    //         setDimensions(getWindowDimensions());
    //     }

    //     reDrawChart();
        
    //     window.addEventListener('resize', handleResize);
    //     return () => window.removeEventListener('resize', handleResize);

    // },[dimensions]);

    const svgStyles = {
        overflow: 'visible'
    }

    return (
        <React.Fragment>
            <div ref={svgDivContainer}>
                <svg
                    // className="d3-chart"
                    style={svgStyles}
                    width='300px'
                    height='450px'
                    ref={svgRef}
                />
            </div>
        </React.Fragment>
    );
}
