import React, {useRef, useEffect} from 'react'
import * as d3 from 'd3'
import { Button } from '@mui/material';

// https://www.freecodecamp.org/news/how-to-get-started-with-d3-and-react-c7da74a5bd9f/
// http://bl.ocks.org/enactdev/a647e60b209e67602304
// https://medium.com/@jeffbutsch/using-d3-in-react-with-hooks-4a6c61f1d102
export default function BarChart({books, addBook}) {

    const d3Container = useRef(null);
    // const scale = 10
    
    useEffect(() => {
        if (books && d3Container.current) {
            const heightValue = window.innerHeight/6
            const widthValue = window.innerWidth/2
            
            const svg = d3.select(d3Container.current).append("svg")
            .attr("viewBox", `0 0 ${widthValue} ${heightValue}`)
            .style("border", "1px solid white");;

            // Bind D3 data
            const update = svg
                .append('g')
                .selectAll('text')
                .data(books);

            // Enter new D3 elements
            update.enter()
                .append('text')
                .attr('x', (d, i) => i * 25)
                .attr('y', (d, i) => i * 25)
                .style('font-size', 24)
                .text((d) => d.author);

            // Update existing D3 elements
            update
                .attr('x', (d, i) => i * 40)
                .text((d) => d.author);

            // Remove old D3 elements
            update.exit()
                .remove();
        }
    },[books, d3Container.current]);

    return (
        <React.Fragment>
            <svg
                className="d3-component"
                width={400}
                height={200}
                ref={d3Container}
            />
            <Button onClick={addBook}>Add Book</Button>
        </React.Fragment>
    );
}