import React from "react";
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";

interface OneSelectProps {
    values: string[];
    selectedValue: string;
    setSelectedValue: (selectedValue: string) => void;
    label: string;
    display: (value: string) => string | undefined;
}


const OneSelect: React.FC<OneSelectProps> = (props) => {
    const {values, selectedValue, setSelectedValue, label, display} = props;

    const handleChange = (event: SelectChangeEvent) => {
        setSelectedValue(event.target.value as string);
    };

    return <FormControl sx={{width: 300}}>
        <InputLabel>{label}</InputLabel>
        <Select
            value={selectedValue}
            label={label}
            onChange={handleChange}
            variant='outlined'>
            {values.map((value) => (
                <MenuItem
                    key={value}
                    value={value}
                >
                    {display(value)}
                </MenuItem>
            ))}
        </Select>
    </FormControl>

}

export default OneSelect;