import React, {useState} from 'react'
import {Button} from '@mui/material'

export default function ToggleButton({name, handleSelect}) {

    const [On, setOn] = useState(true);
    
    const handleClick = (e) => {   
        e.preventDefault(); 
        setOn(!On);
        console.log(e.target.textContent);
    }
    
    return (
        <Button onClick={handleClick} name={name} color={On? 'primary':'secondary'}>
            {name}
        </Button>
    )
}
