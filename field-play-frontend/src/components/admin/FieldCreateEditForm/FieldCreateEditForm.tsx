import {useContext, useEffect, useMemo, useState} from "react";
import {FieldType} from "../../../interfaces/field/FieldType.ts";
import {SurfaceType} from "../../../interfaces/field/SurfaceType.ts";
import FieldCreateEditDto from "../../../interfaces/field/FieldCreateEditDto.ts";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import FieldFullReadDto from "../../../interfaces/field/FieldFullReadDto.ts";
import CityContext from "../../../context/CityProvider.tsx";

interface FieldCreateEditFormProps {
    onSubmit: (field: FieldCreateEditDto) => void;
    open: boolean;
    onClose: () => void;
    companyId: number;
    field?: FieldFullReadDto;
}

const FieldCreateForm = ({companyId, open, onClose, field, onSubmit}: FieldCreateEditFormProps) => {
    const initialFormData = useMemo<FieldCreateEditDto>(() => ({
        name: field ? field.name : "",
        address: field ? field.address : "",
        type: field ? field.type : FieldType.OUTDOOR,
        surfaceType: field ? field.surfaceType : SurfaceType.ARTIFICIAL,
        maxPlayers: field ? field.maxPlayers.toString() : "",
        length: field ? field.length.toString() : "",
        width: field ? field.width.toString() : "",
        height: field ? field.height ? field.height.toString() : "" : "",
        lockerRoom: field ? field.lockerRoom : false,
        stands: field ? field.stands : false,
        shower: field ? field.shower : false,
        lighting: field ? field.lighting : false,
        parkingSpace: field ? field.parkingSpace : false,
        cityId: field ? field.city.id : 1,
        companyId: companyId
    }), [field, companyId]);

    const {cities} = useContext(CityContext);

    const handleSubmit = () => {
        const newValidationErrors: Record<string, string | undefined> = {};

        if (!formData.name) {
            newValidationErrors.name = "Введите название";
        } else if (formData.name.length < 4 || formData.name.length > 40) {
            newValidationErrors.name = "Название должно содержать от 4 до 40 символов";
        }

        if (!formData.address) {
            newValidationErrors.address = "Введите адрес";
        } else if (formData.address.length < 4 || formData.address.length > 40) {
            newValidationErrors.address = "Адрес должен содержать от 4 до 40 символов";
        }

        if (!formData.length) {
            newValidationErrors.length = "Введите длину";
        } else if (!isPositiveInteger(formData.length)) {
            newValidationErrors.length = "Длина должна быть положительным целым числом";
        } else if (Number(formData.length) < 5 || Number(formData.length) > 200) {
            newValidationErrors.length = "Длина должна быть в интервале от 5 до 200";
        }

        if (!formData.width) {
            newValidationErrors.width = "Введите ширину";
        } else if (!isPositiveInteger(formData.width)) {
            newValidationErrors.width = "Ширина должна быть положительным целым числом";
        } else if (Number(formData.width) < 5 || Number(formData.width) > 200) {
            newValidationErrors.width = "Ширина должна быть в интервале от 5 до 200";
        }

        if (formData.height) {
            if (!isPositiveInteger(formData.height)) {
                newValidationErrors.height = "Высота должна быть положительным целым числом";
            } else if (Number(formData.height) < 5 || Number(formData.height) > 200) {
                newValidationErrors.height = "Высота должна быть в интервале от 5 до 200";
            }
        }

        if (!field) {
            if (!formData.maxPlayers) {
                newValidationErrors.maxPlayers = "Введите макс. число игроков";
            } else if (!isPositiveInteger(formData.maxPlayers)) {
                newValidationErrors.maxPlayers = "Макс. число игроков должно быть положительным целым числом";
            } else if (Number(formData.maxPlayers) < 10 || Number(formData.maxPlayers) > 100) {
                newValidationErrors.maxPlayers = "Макс. число игроков должно быть в интервале от 10 до 100";
            }
        }

        setValidationErrors(newValidationErrors);

        if (Object.keys(newValidationErrors).length === 0) {
            onSubmit(formData);
            onClose();
        }
    };

    useEffect(() => {
        if (!open) {
            setFormData(initialFormData);
            setValidationErrors({});
        }
    }, [initialFormData, open]);

    const [formData, setFormData] = useState<FieldCreateEditDto>(initialFormData);
    const [validationErrors, setValidationErrors] = useState<
        Record<string, string | undefined>
    >({});

    return <Dialog open={open} onClose={onClose} className="flex flex-col gap-10">
        <DialogTitle>{field ? 'Изменить поле' : 'Добавить поле'}</DialogTitle>
        <DialogContent className="flex flex-col gap-5" sx={{width: 500, height: 500}}>
            <TextField
                sx={{width: 400}}
                margin="dense"
                label="Название..."
                variant="standard"
                onFocus={() =>
                    setValidationErrors({...validationErrors, name: undefined})
                }
                value={formData.name}
                onChange={(e) => (
                    setFormData({...formData, name: e.target.value})
                )}
                error={!!validationErrors?.name}
                helperText={validationErrors?.name}
            />
            <TextField
                sx={{width: 400}}
                margin="dense"
                label="Адрес..."
                variant="standard"
                value={formData.address}
                onFocus={() =>
                    setValidationErrors({...validationErrors, address: undefined})
                }
                onChange={(e) => (
                    setFormData({...formData, address: e.target.value})
                )}
                error={!!validationErrors.address}
                helperText={validationErrors?.address}
            />
            {
                !field ?
                    <TextField
                        sx={{width: 400}}
                        margin="dense"
                        label="Макс. число игроков..."
                        variant="standard"
                        onFocus={() =>
                            setValidationErrors({...validationErrors, maxPlayers: undefined})
                        }
                        value={formData.maxPlayers}
                        onChange={(e) => (
                            setFormData({...formData, maxPlayers: e.target.value})
                        )}
                        error={!!validationErrors?.maxPlayers}
                        helperText={validationErrors?.maxPlayers}
                    />
                    : ''
            }
            <FormControl sx={{width: 400}}>
                <InputLabel>Покрытие</InputLabel>
                <Select
                    name="type"
                    variant="standard"
                    value={formData.type}
                    onChange={(e) => {
                        setFormData({...formData, type: e.target.value as FieldType})
                    }}
                    required
                >
                    <MenuItem value={FieldType.INDOOR}>Крытая</MenuItem>
                    <MenuItem value={FieldType.OUTDOOR}>Открытая</MenuItem>
                </Select>
            </FormControl>
            <FormControl sx={{width: 400}}>
                <InputLabel>Трава</InputLabel>
                <Select
                    name="type"
                    variant="standard"
                    value={formData.surfaceType}
                    onChange={(e) => {
                        setFormData({...formData, surfaceType: e.target.value as SurfaceType})
                    }}
                    required
                >
                    <MenuItem value={SurfaceType.ARTIFICIAL}>Искусственная</MenuItem>
                    <MenuItem value={SurfaceType.NATURAL}>Трава</MenuItem>
                    <MenuItem value={SurfaceType.LINOLEUM}>Линолеум</MenuItem>
                    <MenuItem value={SurfaceType.PARQUET}>Паркет</MenuItem>
                </Select>
            </FormControl>
            <TextField
                sx={{width: 400}}
                margin="dense"
                label="Длина..."
                variant="standard"
                value={formData.length}
                onFocus={() =>
                    setValidationErrors({...validationErrors, length: undefined})
                }
                onChange={(e) => (
                    setFormData({...formData, length: e.target.value})
                )}
                error={!!validationErrors?.length}
                helperText={validationErrors?.length}
            />
            <TextField
                sx={{width: 400}}
                margin="dense"
                label="Ширина..."
                variant="standard"
                value={formData.width}
                onFocus={() =>
                    setValidationErrors({...validationErrors, width: undefined})
                }
                onChange={(e) => (
                    setFormData({...formData, width: e.target.value})
                )}
                error={!!validationErrors?.width}
                helperText={validationErrors?.width}
            />
            <TextField
                sx={{width: 400}}
                margin="dense"
                label="Высота..."
                variant="standard"
                onFocus={() =>
                    setValidationErrors({...validationErrors, height: undefined})
                }
                value={formData.height}
                onChange={(e) => (
                    setFormData({...formData, height: e.target.value})
                )}
                error={!!validationErrors?.height}
                helperText={validationErrors?.height}
            />
            <FormControl sx={{width: 400}}>
                <InputLabel>Раздевалки</InputLabel>
                <Select
                    name="type"
                    variant="standard"
                    value={formData.lockerRoom}
                    onChange={(e) => {
                        setFormData({...formData, lockerRoom: e.target.value as boolean})
                    }}
                    required
                >
                    <MenuItem value={'true'}>Есть</MenuItem>
                    <MenuItem value={'false'}>Нет</MenuItem>
                </Select>
            </FormControl>
            <FormControl sx={{width: 400}}>
                <InputLabel>Трибуны</InputLabel>
                <Select
                    name="type"
                    variant="standard"
                    value={formData.stands}
                    onChange={(e) => {
                        setFormData({...formData, stands: e.target.value as boolean})
                    }}
                    required
                >
                    <MenuItem value={'true'}>Есть</MenuItem>
                    <MenuItem value={'false'}>Нет</MenuItem>
                </Select>
            </FormControl>
            <FormControl sx={{width: 400}}>
                <InputLabel>Душ</InputLabel>
                <Select
                    name="type"
                    variant="standard"
                    value={formData.shower}
                    onChange={(e) => {
                        setFormData({...formData, shower: e.target.value as boolean})
                    }}
                    required
                >
                    <MenuItem value={'true'}>Есть</MenuItem>
                    <MenuItem value={'false'}>Нет</MenuItem>
                </Select>
            </FormControl>
            <FormControl sx={{width: 400}}>
                <InputLabel>Освещение</InputLabel>
                <Select
                    name="type"
                    variant="standard"
                    value={formData.lighting}
                    onChange={(e) => {
                        setFormData({...formData, lighting: e.target.value as boolean})
                    }}
                    required
                >
                    <MenuItem value={'true'}>Есть</MenuItem>
                    <MenuItem value={'false'}>Нет</MenuItem>
                </Select>
            </FormControl>
            <FormControl sx={{width: 400}}>
                <InputLabel>Парковка</InputLabel>
                <Select
                    name="type"
                    variant="standard"
                    value={formData.parkingSpace}
                    onChange={(e) => {
                        setFormData({...formData, parkingSpace: e.target.value as boolean})
                    }}
                    required
                >
                    <MenuItem value={'true'}>Есть</MenuItem>
                    <MenuItem value={'false'}>Нет</MenuItem>
                </Select>
            </FormControl>
            {
                !field ?
                    <FormControl sx={{width: 400}}>
                        <InputLabel>Город</InputLabel>
                        <Select
                            name="type"
                            variant="standard"
                            value={formData.cityId}
                            onChange={(e) => {
                                setFormData({...formData, cityId: e.target.value as number})
                            }}
                            required
                        >
                            {cities.map((c) => {
                                return <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                    : ''
            }
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="secondary">
                Отмена
            </Button>
            <Button color="primary" onClick={handleSubmit}>
                {field ? 'Изменить' : 'Добавить'}
            </Button>
        </DialogActions>
    </Dialog>

}

export default FieldCreateForm;

function isPositiveInteger(value: string): boolean {
    return /^[1-9]\d*$/.test(value);
}