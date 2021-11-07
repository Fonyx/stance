import React from 'react'
import {Button} from '@mui/material'
import { truncate } from '../helpers/strings'

export default function ToggleButton({name, color, handleSelect}) {
    
    return (
        <Button onClick={handleSelect} name={name} color={color}>
            {truncate(name, 15)}
        </Button>
    )
}
