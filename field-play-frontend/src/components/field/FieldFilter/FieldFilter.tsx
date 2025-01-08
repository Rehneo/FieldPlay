import SearchRequest from "../../../interfaces/search/SearchRequest.ts";
import React, {useState} from "react";
import {getSurfaceTypeDisplay, SurfaceType} from "../../../interfaces/field/SurfaceType.ts";
import {Button, Collapse, createTheme, TextField, ThemeProvider} from "@mui/material";
import "./FieldFilter.css"
import MultipleSelect from "./MultipleSelect.tsx";
import SearchCriteria from "../../../interfaces/search/SearchCriteria.ts";
import {SearchOperator} from "../../../interfaces/search/SearchOperator.ts";

interface FieldFilterProps {
    onApply: (searchRequest: SearchRequest) => void;
}

const surfaceTypes: string[] = Object.values(SurfaceType).filter(() => true);

const featureTypes = [
    'lockerRoom',
    'stands',
    'shower',
    'lighting',
    'parkingSpace'
];

const theme = createTheme(
    {
        palette: {
            primary: {
                main: '#008000',
            },
            secondary: {
                main: '#008000',
            },
        },
    }
)

const getFeatureTypeDisplay = (feature: string) => {
    switch (feature) {
        case 'lockerRoom':
            return 'Раздевалки'
        case 'stands':
            return 'Трибуны'
        case 'shower':
            return 'Душевая'
        case 'lighting':
            return 'Освещение'
        case 'parkingSpace':
            return 'Парковка'
    }
}

const FieldFilter: React.FC<FieldFilterProps> = ({onApply}) => {
    const [address, setAddress] = useState<string>('');
    const [selectedSurfaceTypes, setSelectedSurfaceTypes] = useState<string[]>([]);
    const [selectedFieldType, setSelectedFieldType] = useState<string | undefined>(undefined);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(!open);
    };
    const handleClear = () => {
        setSelectedFieldType(undefined);
        setSelectedFeatures([]);
        setSelectedSurfaceTypes([]);
        setAddress('');
        onApply({list: []});
    }

    const handleApply = () => {
        const criteria: SearchCriteria[] = [];
        if (address.length > 0) {
            criteria.push({
                key: 'address',
                value: address,
                operator: SearchOperator.CONTAINS,
            });
        }
        if (selectedFieldType) {
            criteria.push({
                key: 'type',
                value: selectedFieldType,
                operator: SearchOperator.EQUAL,
            });
        }

        selectedFeatures.map(feature => {
            criteria.push({
                key: feature,
                value: true,
                operator: SearchOperator.EQUAL,
            });
        })

        selectedSurfaceTypes.map(surface => {
            criteria.push({
                key: 'surfaceType',
                value: surface,
                operator: SearchOperator.EQUAL,
            });
        })
        onApply({list: criteria});
    }

    return <ThemeProvider theme={theme}>
        <div className="filter-container">
            <TextField
                label="Адрес"
                value={address}
                variant="standard"
                sx={{marginBottom: 2, width: "100%"}}
                onChange={(e) => {
                    setAddress(e.target.value)
                    handleApply();
                }}/>
            <Button color="primary" onClick={handleOpen} className="button-font">
                Фильтры
            </Button>
        </div>
        <Collapse in={open} timeout="auto" unmountOnExit>
            <div className="field-filter-container">
                <div className="type-filter-container">
                    <Button variant={selectedFieldType == 'OUTDOOR' ? 'contained' : 'outlined'}
                            onClick={() => {
                                setSelectedFieldType('OUTDOOR')
                            }}
                            className="field-type-button button-font">
                        Открытая
                    </Button>
                    <Button variant={selectedFieldType == 'INDOOR' ? 'contained' : 'outlined'}
                            onClick={() => {
                                setSelectedFieldType('INDOOR')
                            }}
                            className="field-type-button  button-font">
                        Крытая
                    </Button>
                </div>
                <div className="surface-type-container">
                    <MultipleSelect values={surfaceTypes}
                                    selectedValues={selectedSurfaceTypes}
                                    setSelectedValues={setSelectedSurfaceTypes}
                                    label='Покрытие'
                                    display={getSurfaceTypeDisplay}
                    />
                    <MultipleSelect values={featureTypes}
                                    selectedValues={selectedFeatures}
                                    setSelectedValues={setSelectedFeatures}
                                    label='Инфраструктура'
                                    display={getFeatureTypeDisplay}
                    />
                </div>
                <div className="apply-container">
                    <Button className="button-font" variant='contained' onClick={handleApply}>Применить</Button>
                    <Button className="button-font" variant='contained' onClick={handleClear}>Очистить</Button>
                </div>
            </div>
        </Collapse>
    </ThemeProvider>
}

export default FieldFilter;