import {Button, CircularProgress, TextField} from "@mui/material";
import userService from "../../services/UserService.ts";
import {useAuth} from "../../context/UserAuth.tsx";
import {toast, ToastContainer} from "react-toastify";
import {UNHANDLED_ERROR_MESSAGE} from "../../config/constants.tsx";
import {useState} from "react";
import "./BalancePage.css"
import Header from "../../components/header/Header.tsx";

const BalancePage = () => {
    const [amount, setAmount] = useState('');
    const {updateUser} = useAuth();
    const [formError, setFormError] = useState<string>("");
    const [isPending, setIsPending] = useState<boolean>(false);
    const maxLength = 5;

    const handleSubmit = async () => {
        const isValidSum = /^[1-9]\d*$/.test(amount);
        if (!isValidSum) {
            setFormError("Сумма пополнения должна быть положительным целым числом");
            return;
        }
        setIsPending(true);
        try {
            const response = await userService.updateBalance(Number(amount));
            toast.success(`Баланс успешно пополнен.\nТекущий баланс: ${response.data.balance}`);
            updateUser(response.data);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error(UNHANDLED_ERROR_MESSAGE);
        } finally {
            setIsPending(false);
        }
    }


    return <>
        <Header/>
        <div className='balance-update-container'>
            <label>Пополнить баланс</label>
            <TextField
                label="Введите сумму..."
                value={amount}
                type="number"
                variant="standard"
                error={!!formError}
                helperText={formError}
                slotProps={{input: {inputProps: {maxLength: 5}}}}
                sx={{marginBottom: 2, width: "100%"}}
                onChange={(e) => {
                    if (e.target.value.length <= maxLength) {
                        setAmount(e.target.value);
                    }
                }}
                onFocus={() => {
                    setFormError('')
                }}
            />
            <div className="pending-container">
                {isPending
                    ? <CircularProgress/>
                    : ''
                }
            </div>
            <Button color="primary" onClick={handleSubmit} variant="contained" className="button-font">
                Пополнить
            </Button>
            <ToastContainer/>
        </div>
    </>
}

export default BalancePage;