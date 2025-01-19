import SessionCreateEditDto from "../../../interfaces/session/SessionCreateEditDto.ts";
import SessionReadDto from "../../../interfaces/session/SessionReadDto.ts";
import {useEffect, useMemo, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";

interface SessionCreateEditFormProps {
    onSubmit: (session: SessionCreateEditDto) => void;
    open: boolean;
    onClose: () => void;
    fieldId: number;
    session?: SessionReadDto;
}

const SessionCreateEditForm = ({session, fieldId, open, onClose, onSubmit}: SessionCreateEditFormProps) => {

    const initialFormData = useMemo<SessionCreateEditDto>(() => ({
        id: session ? session.id : undefined,
        signUpPrice: session ? session.signUpPrice.toString() : "",
        bookingPrice: session ? session.bookingPrice.toString() : "",
        minPlayers: session ? session.minPlayers.toString() : "",
        fieldId: session ? undefined : fieldId
    }), [session, fieldId]);

    const handleSubmit = () => {
        const newValidationErrors: Record<string, string | undefined> = {};

        if (!formData.signUpPrice) {
            newValidationErrors.signUpPrice = "Введите цену за запись";
        } else if (!isPositiveInteger(formData.signUpPrice)) {
            newValidationErrors.signUpPrice = "Цена за запись должна быть положительным целым числом";
        } else if (Number(formData.signUpPrice) < 100 || Number(formData.signUpPrice) > 5000) {
            newValidationErrors.signUpPrice = "Цена за запись должна быть в интервале от 100 до 5000";
        }

        if (!formData.bookingPrice) {
            newValidationErrors.bookingPrice = "Введите цену за бронирование";
        } else if (!isPositiveInteger(formData.bookingPrice)) {
            newValidationErrors.bookingPrice = "Цена за бронирование должна быть положительным целым числом";
        } else if (Number(formData.bookingPrice) < 100 || Number(formData.bookingPrice) > 5000) {
            newValidationErrors.bookingPrice = "Цена за бронирование должна быть в интервале от 100 до 5000";
        }

        if (!formData.minPlayers) {
            newValidationErrors.minPlayers = "Введите мин. число игроков";
        } else if (!isPositiveInteger(formData.minPlayers)) {
            newValidationErrors.minPlayers = "Мин. число игроков должно быть положительным целым числом";
        } else if (Number(formData.minPlayers) < 1 || Number(formData.minPlayers) > 20) {
            newValidationErrors.minPlayers = "Мин. число игроков должно быть в интервале от 1 до 20";
        }

        setValidationErrors(newValidationErrors);

        if (Object.keys(newValidationErrors).length === 0) {
            onSubmit(formData);
            onClose();
        }
    };


    useEffect(() => {
        setFormData(initialFormData);
        if (!open) {
            setValidationErrors({});
        }
    }, [initialFormData, open]);

    const [formData, setFormData] = useState<SessionCreateEditDto>(initialFormData);
    const [validationErrors, setValidationErrors] = useState<
        Record<string, string | undefined>
    >({});

    return <Dialog open={open} onClose={onClose} className="flex flex-col gap-10">
        <DialogTitle>{session ? 'Изменить сеанс' : 'Заполнить неделю'}</DialogTitle>
        <DialogContent className="flex flex-col gap-5" sx={{width: 500}}>
            <TextField
                sx={{width: 400}}
                margin="dense"
                label="Цена за запись..."
                variant="standard"
                onFocus={() =>
                    setValidationErrors({...validationErrors, signUpPrice: undefined})
                }
                value={formData.signUpPrice}
                onChange={(e) => (
                    setFormData({...formData, signUpPrice: e.target.value})
                )}
                error={!!validationErrors?.signUpPrice}
                helperText={validationErrors?.signUpPrice}
            />
            <TextField
                sx={{width: 400}}
                margin="dense"
                label="Цена за бронирование..."
                variant="standard"
                onFocus={() =>
                    setValidationErrors({...validationErrors, bookingPrice: undefined})
                }
                value={formData.bookingPrice}
                onChange={(e) => (
                    setFormData({...formData, bookingPrice: e.target.value})
                )}
                error={!!validationErrors?.bookingPrice}
                helperText={validationErrors?.bookingPrice}
            />
            <TextField
                sx={{width: 400}}
                margin="dense"
                label="Мин. число игроков..."
                variant="standard"
                onFocus={() =>
                    setValidationErrors({...validationErrors, minPlayers: undefined})
                }
                value={formData.minPlayers}
                onChange={(e) => (
                    setFormData({...formData, minPlayers: e.target.value})
                )}
                error={!!validationErrors?.minPlayers}
                helperText={validationErrors?.minPlayers}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="secondary">
                Отмена
            </Button>
            <Button color="primary" onClick={handleSubmit}>
                {session ? 'Изменить' : 'Заполнить'}
            </Button>
        </DialogActions>
    </Dialog>
}

export default SessionCreateEditForm;

function isPositiveInteger(value: string): boolean {
    return /^[1-9]\d*$/.test(value);
}