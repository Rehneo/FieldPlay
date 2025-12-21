import SearchRequest from "../../../interfaces/search/SearchRequest.ts";
import React, {useContext, useState} from "react";
import {getSurfaceTypeDisplay, SurfaceType} from "../../../interfaces/field/SurfaceType.ts";
import {
    Button,
    Collapse,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    TextField
} from "@mui/material";
import "./FieldFilter.css"
import MultipleSelect, {ITEM_HEIGHT, ITEM_PADDING_TOP} from "../../select/MultipleSelect.tsx";
import SearchCriteria from "../../../interfaces/search/SearchCriteria.ts";
import {SearchOperator} from "../../../interfaces/search/SearchOperator.ts";
import OneSelect from "../../select/OneSelect.tsx";
import CityContext from "../../../context/CityProvider.tsx";

interface FieldFilterProps {
    onApply: (searchRequest: SearchRequest) => void;
}

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const surfaceTypes: string[] = Object.values(SurfaceType).filter(() => true);

const featureTypes = [
    'lockerRoom',
    'stands',
    'shower',
    'lighting',
    'parkingSpace'
];

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
    const {stations} = useContext(CityContext);
    const [address, setAddress] = useState<string>('');
    const [selectedSurfaceType, setSelectedSurfaceType] = useState<string>('');
    const [selectedFieldType, setSelectedFieldType] = useState<string | undefined>(undefined);
    const [selectedStations, setSelectedStations] = useState<string[]>([]);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [open, setOpen] = React.useState(false);

    const handleClear = () => {
        setSelectedFieldType(undefined);
        setSelectedFeatures([]);
        setAddress('');
        setSelectedSurfaceType('');
        setSelectedStations([]);
        onApply({criteriaList: []});
    }

    const handleFilterButtonClear = () => {
        setSelectedFieldType(undefined);
        setSelectedFeatures([]);
        setSelectedStations([]);
        setSelectedSurfaceType('');
    }

    const handleStationChange = (event: SelectChangeEvent<typeof selectedStations>) => {
        const {
            target: {value},
        } = event;
        setSelectedStations(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

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
                operator: SearchOperator.STR_EQUAL,
            });
        }

        selectedFeatures.map(feature => {
            criteria.push({
                key: feature,
                value: true,
                operator: SearchOperator.STR_EQUAL,
            });
        })

        if (selectedStations.length > 0) {
            criteria.push({
                key: 'stationIds',
                value: selectedStations,
                operator: SearchOperator.NESTED_STATION_ID
            });
        }

        if (selectedSurfaceType.length > 0) {
            criteria.push({
                key: 'surfaceType',
                value: selectedSurfaceType,
                operator: SearchOperator.STR_EQUAL,
            })
        }
        onApply({criteriaList: criteria});
    }

    return <>
        <div className="filter-container">
            <TextField
                label="Адрес"
                value={address}
                variant="standard"
                sx={{marginBottom: 2, width: "100%"}}
                onChange={(e) => {
                    setAddress(e.target.value);
                }}/>
            <Button color="primary" onClick={handleApply} className="button-font">
                Поиск
            </Button>
            <Button color="primary" onClick={() => {
                setOpen(!open);
                handleFilterButtonClear();
            }}
                    className="button-font">
                Фильтры
            </Button>
        </div>
        <Collapse in={open} timeout="auto" unmountOnExit>
            <div className="field-filter-container">
                <div className="type-filter-container">
                    <Button variant={selectedFieldType == 'OUTDOOR' ? 'contained' : 'outlined'}
                            onClick={() => {
                                setSelectedFieldType('OUTDOOR');
                            }}
                            className="field-type-button button-font">
                        Открытая
                    </Button>
                    <Button variant={selectedFieldType == 'INDOOR' ? 'contained' : 'outlined'}
                            onClick={() => {
                                setSelectedFieldType('INDOOR');
                            }}
                            className="field-type-button  button-font">
                        Крытая
                    </Button>
                </div>
                <div className="surface-type-container">
                    <OneSelect values={surfaceTypes}
                               selectedValue={selectedSurfaceType}
                               setSelectedValue={setSelectedSurfaceType}
                               label='Покрытие'
                               display={getSurfaceTypeDisplay}/>
                    <MultipleSelect values={featureTypes}
                                    selectedValues={selectedFeatures}
                                    setSelectedValues={setSelectedFeatures}
                                    label='Инфраструктура'
                                    display={getFeatureTypeDisplay}/>
                    <FormControl sx={{width: 300, maxHeight: 100}}>
                        <InputLabel>Метро</InputLabel>
                        <Select
                            multiple
                            value={selectedStations}
                            input={<OutlinedInput label='Метро'/>}
                            onChange={handleStationChange}
                            MenuProps={MenuProps}
                            variant='outlined'>
                            {stations.map((station) => (
                                <MenuItem
                                    key={station.id}
                                    value={station.id}
                                >
                                    {station.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="apply-container">
                    <Button className="button-font" variant='contained' onClick={handleApply}>Применить</Button>
                    <Button className="button-font" variant='contained' onClick={handleClear}>Очистить</Button>
                </div>
            </div>
        </Collapse></>
}

export default FieldFilter;