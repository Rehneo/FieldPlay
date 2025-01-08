import {
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    Theme,
    useTheme
} from "@mui/material";
import React from "react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name: string, selectedValues: string[], theme: Theme) {
    return {
        fontWeight: selectedValues.includes(name)
            ? theme.typography.fontWeightMedium
            : theme.typography.fontWeightRegular,
    };
}

interface MultipleSelectProps {
    values: string[];
    selectedValues: string[];
    setSelectedValues: (selectedValues: string[]) => void;
    label: string;
    display: (value: string) => string | undefined;
}

const MultipleSelect: React.FC<MultipleSelectProps> = (props) =>{
    const {values, selectedValues, setSelectedValues, label, display} = props;
    const theme = useTheme();

    const handleChange = (event: SelectChangeEvent<typeof selectedValues>) => {
        const {
            target: { value },
        } = event;
        setSelectedValues(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <div>
            <FormControl sx={{width: 300}}>
                <InputLabel id="demo-multiple-name-label">{label}</InputLabel>
                <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    value={selectedValues}
                    onChange={handleChange}
                    input={<OutlinedInput label={label} />}
                    MenuProps={MenuProps}
                    variant='outlined'>
                    {values.map((value) => (
                        <MenuItem
                            key={value}
                            value={value}
                            style={getStyles(value, selectedValues, theme)}
                        >
                            {display(value)}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

export default MultipleSelect;