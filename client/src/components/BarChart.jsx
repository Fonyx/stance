import React, {useRef, useEffect} from 'react'
import * as d3 from 'd3'
import { Button } from '@mui/material';

// https://www.freecodecamp.org/news/how-to-get-started-with-d3-and-react-c7da74a5bd9f/
// http://bl.ocks.org/enactdev/a647e60b209e67602304
// https://medium.com/@jeffbutsch/using-d3-in-react-with-hooks-4a6c61f1d102
export default function BarChart({testData, addBook}) {

    const d3Container = useRef(null);
    // const scale = 10
    
    useEffect(() => {
        if (testData && d3Container.current) {

            const heightValue = window.innerHeight/6
            const widthValue = window.innerWidth/2
            const scale = 10
            
            const svg = d3.select(d3Container.current).append("svg")
            .attr("viewBox", `0 0 ${widthValue} ${heightValue}`)

            svg.selectAll("rect")
                .data(testData).enter()
                    .append("rect")
                    .attr("width", 40)
                    .attr("height", (datapoint) => datapoint * scale)
                    .attr("fill", "orange")
                    .attr("x", (_, iteration) => iteration * 45)
                    .attr("y", (datapoint) => heightValue - datapoint * scale);

                    svg.selectAll("text")
            .data(testData).enter()
                .append("text")
                .attr("x", (_, i) => i * 45 + 10)
                .attr("y", (dataPoint, i) => heightValue - dataPoint * scale - 10)
                .text(dataPoint => dataPoint)
                .style("fill", "white");
            }

    },[testData, d3Container.current]);

    return (
        <React.Fragment>
            <svg
                className="d3-component"
                width={800}
                height={400}
                ref={d3Container}
            />
            <Button onClick={addBook}>Add Data</Button>
        </React.Fragment>
    );
}