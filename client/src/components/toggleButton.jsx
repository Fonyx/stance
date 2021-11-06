import React, {useState} from 'react'
import {Button} from '@mui/material'

export default function ToggleButton({name, handleSelect}) {

    const [On, setOn] = useState(true);
    
    const handleClick = (e) => {   
        e.preventDefault(); 
        setOn(!On);
        handleSelect(e, On);
    }
    
    return (
        <Button onClick={handleClick} name={name} color={On? 'secondary':'primary'}>
            {name}
        </Button>
    )
}
