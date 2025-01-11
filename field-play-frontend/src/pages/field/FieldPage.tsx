import {useParams} from "react-router-dom";
import Header from "../../components/header/Header.tsx";
import "./FieldPage.css"
import FeedbackController from "../../components/feedback/FeedbackController.tsx";
import SessionTableController from "../../components/session/SessionTableController/SessionTableController.tsx";
import {useEffect, useState} from "react";
import FieldFullReadDto from "../../interfaces/field/FieldFullReadDto.ts";
import fieldService from "../../services/FieldService.ts";
import {AxiosError, HttpStatusCode} from "axios";
import {CircularProgress} from "@mui/material";
import NotFoundPage from "../NotFoundPage.tsx";
import FieldDetails from "../../components/field/FieldDetails/FieldDetails.tsx";


const FieldPage = () => {
    const {fieldId} = useParams();
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [field, setField] = useState<FieldFullReadDto | null>(null);
    const [isNotFound, setIsNotFound] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const response = await fieldService.getById(Number(fieldId));
                setField(response.data);
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
    })

    if (isLoading) {
        return <CircularProgress/>;
    }

    if (isNotFound) {
        return <NotFoundPage/>;
    }
    if (isError) {
        return <span>Произошла ошибка при загрузке поля</span>;
    }
    return <div className="field-page-container">
        <Header/>
        <FieldDetails field={field!}/>
        <SessionTableController fieldId={Number(fieldId)}/>
        <FeedbackController fieldId={Number(fieldId)}/>
    </div>
}

export default FieldPage;