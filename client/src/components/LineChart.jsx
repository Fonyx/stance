import React, {useEffect, useState, useRef} from 'react'
import {select, csv, timeParse, scaleTime, extent, axisBottom, scaleLinear, axisLeft, max, line} from 'd3';

//https://www.d3-graph-gallery.com/graph/line_basic.html

function getWindowDimensions() {
    const { innerWidth: rawWidth, innerHeight: rawHeight } = window;
    let width = 0.8*rawWidth;
    let height = 0.8*rawHeight;
    return {
        width,
        height
    };
}

export default function LineChart({transactions}) {

    const svgDivContainer = useRef();
    const svgRef = useRef();

    const [dimensions, setDimensions] = useState(getWindowDimensions());

    // const dimensions = {width: window.innerWidth*0.8, height: window.innerHeight*0.5}

    const reDrawChart = () => {
        const svg = select(svgRef.current);

        svg.selectAll('path').remove();
        svg.selectAll('g').remove();

        // if there are no dimensions, return - first load will have no dimensions returned from resizeObeserver
        console.log(dimensions)

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

        //Read the data
        csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",

        // When reading the csv, I must format variables:
        function(d){
            return { date : timeParse("%Y-%m-%d")(d.date), value : d.value }
        }).then(

        // Now I can use this dataset:
        function(data) {

            // Add X axis --> it is a date format
            const x = scaleTime()
            .domain(extent(data, function(d) { return d.date; }))
            .range([ 0, width ]);
            svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(axisBottom(x));

            // Add Y axis
            const y = scaleLinear()
            .domain([0, max(data, function(d) { return +d.value; })])
            .range([ height, 0 ]);
            svg.append("g")
            .call(axisLeft(y));

            // Add the line
            svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line()
                .x(function(d) { return x(d.date) })
                .y(function(d) { return y(d.value) })
                )

        })

    }

    console.log('transactions are: ', transactions)

    useEffect(() => {

        function handleResize() {
            setDimensions(getWindowDimensions());
        }

        reDrawChart();
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);

    },[dimensions]);

    const svgStyles = {
        display: "block",
        margin: "auto"
    }

    return (
        <React.Fragment>
            <div ref={svgDivContainer} >
                <svg
                    // className="d3-chart"
                    style={svgStyles}
                    ref={svgRef}
                />
            </div>
        </React.Fragment>
    );
}
