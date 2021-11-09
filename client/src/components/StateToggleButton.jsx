import React, { useState } from 'react'
import {Button} from '@mui/material'
import { truncate } from '../helpers/strings'

export default function StateToggleButton({name}) {

    const [on, setOn] = useState(false);
    
    const handleChange = (e) => {
        e.preventDefault();
        setOn(!on);
    }

    return (
        <Button onClick={handleChange} 
        id={name} 
        name={name} 
        color={on? 'primary': 'secondary'}
        >
            {truncate(name, 25)}
        </Button>
    )
}
