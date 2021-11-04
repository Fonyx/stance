import React, {useRef, useState, useEffect} from 'react'
import {Button} from '@mui/material';
import {select} from 'd3'

// https://www.youtube.com/watch?v=9uEmNgHzPhQ&list=PLDZ4p-ENjbiPo4WH7KdHjh_EMI7Ic8b2B

export default function BarChart({accounts}) {

    const [data, setData] = useState([ 2, 4, 2, 6, 8 ]);
    const svgDivContainer = useRef();
    const svgRef = useRef();

    const updateData = () => {
        console.log('Shuffling Data');
        setData(data.map(value => value + Math.ceil(Math.random()*5)));
    }
    
    const popData = () => {
        console.log('Pop Data');
        setData(data.slice(1));
    }

    const pushData = () => {
        console.log('Push Data');
        let newData = Math.ceil(Math.random()*10);
        setData([...data, newData]);
    }

    const reDrawChart = () => {
        const svg = select(svgRef.current);

        // svg.selectAll('circle').remove();

        // add data to the svg using d3
        svg.selectAll('rect')
            .data(data)
            .join(
                // paint the circles on enter as orange
                enter => enter.append('circle').attr('fill', 'orange'),
                // paint the circles on enter as green
                update => update.attr('fill', 'blue'),
                exit => exit.remove()
            )
            .attr('r', value => value)
            .attr('cx', (d) => d*Math.random()*40)
            .attr('cy', (d) => d*Math.random()*25)
    }
    
    useEffect(() => {
        reDrawChart();
    },[data]);

    console.log('Data is: ', data)

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
            <Button onClick={updateData}>Update Data</Button>
            <Button onClick={pushData}>Push Data</Button>
            <Button onClick={popData}>Pop Data</Button>
        </React.Fragment>
    );
}