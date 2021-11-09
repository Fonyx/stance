import React, {useRef, useState, useEffect} from 'react'
import {select, scaleTime, timeParse, extent, axisBottom, scaleLinear, axisLeft, max, min, line} from 'd3';
import {Grid, Typography} from '@mui/material'

//https://www.d3-graph-gallery.com/graph/line_basic.html

function getWindowDimensions() {
    const { innerWidth: rawWidth, innerHeight: rawHeight } = window;
    let width = 0.8*rawWidth;
    let height = 0.4*rawHeight;
    if(width >= 800){
        width = 800;
    }
    if(height >= 600){
        height = 600;
    }
    return {
        width,
        height
    };
}


function parseDateFormat(d){
    let date = timeParse("%Y-%m-%d")(d.date);
    let value = d.date;
    // console.log(date, value);
    return { date, value }
}


/**
 * Plots out a transaction stream, elements are structured [date, balance, [detailObjs]]
 * @param {[streamElementObj]} {date, balance, [trans names for day]} 
 * @returns 
 */
export default function AssetChart({data}) {

    // console.log('Chart received data: ',data);

    const svgDivContainer = useRef();
    const svgRef = useRef();

    const [dimensions, setDimensions] = useState(getWindowDimensions());

    // const dimensions = {width: window.innerWidth*0.8, height: window.innerHeight*0.5}

    const reDrawChart = () => {
        const svg = select(svgRef.current);

        svg.selectAll('path').remove();
        svg.selectAll('g').remove();

        // let dimensions = {width: "600", height: "400"};

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
        .domain(extent(data, function(d) { 
            let newDate = parseDateFormat(d);
            return newDate.date; 
        }))
        .range([ 0, width ]);

        svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(axisBottom(x));

        // Add Y axis
        const y = scaleLinear()
        .domain([
            min(data, function(d) { return d.open; }), 
            max(data, function(d) { return d.open; })])
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
            .x(function(d) { 
                let parsedDate = parseDateFormat(d);
                return x(parsedDate.date) 
            })
            .y(function(d) { return y(d.open) })
        )

    }

    reDrawChart();

    useEffect(() => {

        function handleResize() {
            setDimensions(getWindowDimensions());
        }

        reDrawChart();
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);

    },[dimensions]);

    const divStyle = {
        margin: '30px'
    }

    const svgStyles = {
        overflow: 'visible'
    }

    return (
        <Grid container justifyContent="center" aligntItems="center">
            <div ref={svgDivContainer} style={divStyle}>
                <svg
                    // className="d3-chart"
                    style={svgStyles}
                    // width='600px'
                    // height='450px'
                    ref={svgRef}
                />
            </div>
        </Grid>
    );
}
