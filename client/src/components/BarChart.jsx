import React, {useRef, useState, useEffect} from 'react'
import {Button} from '@mui/material';
import {select} from 'd3'

// https://www.youtube.com/watch?v=9uEmNgHzPhQ&list=PLDZ4p-ENjbiPo4WH7KdHjh_EMI7Ic8b2B

export default function BarChart({accounts}) {

    // const [data, setData] = useState([ 2, 4, 2, 6, 8 ]);
    const svgDivContainer = useRef();
    const svgRef = useRef();

    // const updateData = () => {
    //     console.log('Shuffling Data');
    //     setData(data.map(value => value + Math.ceil(Math.random()*5)));
    // }
    
    // const popData = () => {
    //     console.log('Pop Data');
    //     setData(data.slice(1));
    // }

    // const pushData = () => {
    //     console.log('Push Data');
    //     let newData = Math.ceil(Math.random()*10);
    //     setData([...data, newData]);
    // }

    const reDrawChart = () => {
        const svg = select(svgRef.current);

        svg.selectAll('circle').remove();

        // add data to the svg using d3
        svg.selectAll('rect')
            .data(accounts)
            .join(
                // paint the circles on enter as orange
                enter => enter
                    // .append('circle')
                    // .attr('r', Math.random()*100)
                    // .attr('cx', (d, i) => i*Math.random()*40)
                    // .attr('cy', (d, i) => i*Math.random()*25)
                    // .attr('fill', 'orange')
                    .append('text')
                    .attr('dx', () => 20)
                    .attr('x', (d, i) => i*10)
                    .attr('y', (d, i) => i*10)
                    .text((d) => d.name),
                // paint the circles on update as green
                update => update.attr('fill', 'green'),
                exit => exit.remove()
            )
            
    }
    
    useEffect(() => {
        reDrawChart();
    },[]);

    console.log('Data is: ', accounts)

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
            {/* <Button onClick={updateData}>Update Data</Button>
            <Button onClick={pushData}>Push Data</Button>
            <Button onClick={popData}>Pop Data</Button> */}
        </React.Fragment>
    );
}