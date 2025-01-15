import "../field/FieldPage.css";
import Header from "../../components/header/Header.tsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import FieldFullReadDto from "../../interfaces/field/FieldFullReadDto.ts";
import fieldService from "../../services/FieldService.ts";
import {AxiosError, HttpStatusCode} from "axios";
import {CircularProgress} from "@mui/material";
import NotFoundPage from "../NotFoundPage.tsx";
import companyService from "../../services/CompanyService.ts";
import AccessDeniedPage from "../AccessDeniedPage.tsx";
import FieldDetails from "../../components/field/FieldDetails/FieldDetails.tsx";
import FieldCreateEditForm from "../../components/admin/FieldCreateEditForm/FieldCreateEditForm.tsx";
import FieldCreateEditDto from "../../interfaces/field/FieldCreateEditDto.ts";
import {toast, ToastContainer} from "react-toastify";
import {UNHANDLED_ERROR_MESSAGE} from "../../config/constants.tsx";

const AdminFieldPage = () => {
    const {fieldId} = useParams();
    const {companyId} = useParams();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [field, setField] = useState<FieldFullReadDto | undefined>(undefined);
    const [isNotFound, setIsNotFound] = useState(false);
    const [openForm, setOpenForm] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const fieldResponse = await fieldService.getById(Number(fieldId));
                const adminResponse = await companyService.isAdmin(Number(companyId));
                setField(fieldResponse.data);
                setIsAdmin(adminResponse)
            } catch (error) {
                if (error instanceof AxiosError) {
                    if (error.status == HttpStatusCode.NotFound) {
                        setIsNotFound(true);
                        return;
                    }
                }
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [companyId, fieldId])

    const onEditSubmit = async (updatedField: FieldCreateEditDto) => {
        try {
            const response = await fieldService.update(field!.id, updatedField);
            setField(response.data);
            toast.success("Футбольное поле было успешно изменено");
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error(UNHANDLED_ERROR_MESSAGE);
        }
    }

    if (isLoading) {
        return <CircularProgress/>;
    }

    if (isNotFound) {
        return <NotFoundPage/>;
    }
    if (!isAdmin) {
        return <AccessDeniedPage/>
    }

    if (isError) {
        return <span className="text-red-600">Произошла ошибка при загрузке поля</span>;
    }
    return <div className="field-page-container">
        <Header/>
        <FieldDetails field={field!}
                      onEdit={() => setOpenForm(true)}
        />
        <FieldCreateEditForm onSubmit={onEditSubmit}
                             open={openForm}
                             onClose={() => setOpenForm(false)}
                             companyId={Number(companyId)}
                             field={field}
        />
        <ToastContainer/>
    </div>
}

export default AdminFieldPage;