import * as React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

import {QUERY_GET_ALL_PARTIES} from '../utils/queries';
import { useQuery } from '@apollo/client';

const filter = createFilterOptions();

export default function PartyAutoCompleteAdd() {
    const [value, setValue] = React.useState(null);
    const [open, toggleOpen] = React.useState(false);

    const {loading, data} = useQuery(QUERY_GET_ALL_PARTIES, {});

    const parties = data?.allParties.map((partyObj) => {
        return {
            'name': partyObj.name,
            'type': partyObj.type,
            'description': partyObj.description,
            'website': partyObj.website,
            'logo': partyObj.logo
        }
    }) || [];

    const [dialogValue, setDialogValue] = React.useState({
        name: '',
        type: 'bank',
        description: '',
        website: ''
    });

    if(loading){
    return ( 
        <div>Loading</div>
    )
    }else{
        console.log(parties);
    }

    const handleClose = () => {
    setDialogValue({
        name: '',
        type: 'bank',
        description: '',
        website: ''
    });

    toggleOpen(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setValue({
        name: dialogValue.name,
        type: dialogValue.type,
        description: dialogValue.type,
        website: dialogValue.type,
        });

        handleClose();
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setDialogValue({
            ...dialogValue,
            [name]: value,
        });
    };

    return (
        <React.Fragment>
        <Autocomplete
            value={value}
            onChange={(event, newValue) => {
            if (typeof newValue === 'string') {
                // timeout to avoid instant validation of the dialog's form.
                setTimeout(() => {
                toggleOpen(true);
                setDialogValue({
                    name: newValue,
                    year: '',
                });
                });
            } else if (newValue && newValue.inputValue) {
                toggleOpen(true);
                setDialogValue({
                name: newValue.inputValue,
                year: '',
                });
            } else {
                setValue(newValue);
            }
            }}
            filterOptions={(options, params) => {
            const filtered = filter(options, params);

            if (params.inputValue !== '') {
                filtered.push({
                inputValue: params.inputValue,
                name: `Add "${params.inputValue}"`,
                });
            }

            return filtered;
            }}
            id="Party"
            options={parties}
            getOptionLabel={(option) => {
            // e.g value selected with enter, right from the input
            if (typeof option === 'string') {
                return option;
            }
            if (option.inputValue) {
                return option.inputValue;
            }
            return option.name;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            renderOption={(props, option) => <li {...props}>{option.name}</li>}
            sx={{ width: 300 }}
            freeSolo
            renderInput={(params) => <TextField {...params} label="3rd Party Affiliate" />}
        />
        <Dialog open={open} onClose={handleClose}>
            <form onSubmit={handleSubmit}>
            <DialogTitle>Add A New 3rd Party Affiliate</DialogTitle>
            <DialogContent>
                <DialogContentText>
                A Different 3rd Party?
                </DialogContentText>
                <TextField
                autoFocus
                margin="dense"
                id="name"
                value={dialogValue.name}
                onChange={(event) =>
                    setDialogValue({
                    ...dialogValue,
                    name: event.target.value,
                    })
                }
                label="name"
                type="text"
                variant="standard"
                />
                <FormControl sx={{width: '25ch'}}>
                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value="bank"
                            label="Type"
                            onChange={handleChange}
                        >
                            <MenuItem value={10}>bank</MenuItem>
                            <MenuItem value={20}>wallet</MenuItem>
                            <MenuItem value={30}>broker</MenuItem>
                        </Select>
                    </FormControl>
                {/* <TextField
                margin="dense"
                id="type"
                value={dialogValue.type}
                onChange={(event) =>
                    setDialogValue({
                    ...dialogValue,
                    type: event.target.value,
                    })
                }
                label="type"
                type="text"
                variant="standard"
                /> */}
                <TextField
                margin="dense"
                id="description"
                value={dialogValue.description}
                onChange={(event) =>
                    setDialogValue({
                    ...dialogValue,
                    description: event.target.value,
                    })
                }
                label="description"
                type="text"
                variant="standard"
                />
                <TextField
                margin="dense"
                id="website"
                value={dialogValue.year}
                onChange={(event) =>
                    setDialogValue({
                    ...dialogValue,
                    website: event.target.value,
                    })
                }
                label="website"
                type="text"
                variant="standard"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">Add</Button>
            </DialogActions>
            </form>
        </Dialog>
        </React.Fragment>
    );
}