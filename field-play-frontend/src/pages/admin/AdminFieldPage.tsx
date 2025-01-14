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

const AdminFieldPage = () => {
    const {fieldId} = useParams();
    const {companyId} = useParams();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [field, setField] = useState<FieldFullReadDto | null>(null);
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
    </div>
}

export default AdminFieldPage;