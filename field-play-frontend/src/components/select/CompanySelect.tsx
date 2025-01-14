import React from "react";
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import Company from "../../interfaces/company/Company.ts";

interface CompanySelectProps {
    disabled?: boolean;
    selectedCompany: Company | undefined;
    onChange: (event: SelectChangeEvent<number>) => void;
    companies: Company[];
}

const CompanySelect: React.FC<CompanySelectProps> = (props) => {
    const {selectedCompany, disabled, onChange, companies} = props;
    return <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel>Выберите компанию</InputLabel>
        <Select
            value={selectedCompany?.id || ''}
            onChange={onChange}
            variant='standard'
            label="Select Company"
            disabled={disabled}
        >
            {companies.map((c: Company) => (
                <MenuItem key={c.id} value={c.id}>
                    {c.name}
                </MenuItem>
            ))}
        </Select>
    </FormControl>

}


export default CompanySelect;