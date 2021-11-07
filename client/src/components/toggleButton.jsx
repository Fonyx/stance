import React from 'react'
import {Button} from '@mui/material'
import { truncate } from '../helpers/strings'

export default function ToggleButton({name, color, handleSelect}) {
    
    return (
        <Button onClick={handleSelect} id={name} name={name} color={color}>
            {truncate(name, 25)}
        </Button>
    )
}
