import {useParams} from "react-router-dom";
import Header from "../../components/header/Header.tsx";
import "./FieldPage.css"
import FieldDetailsController from "../../components/field/FieldDetails/FieldDetailsController.tsx";


const FieldPage = () => {
    const {fieldId} = useParams();
    return <div className="field-page-container">
        <Header/>
        <FieldDetailsController fieldId={fieldId!}/>
    </div>
}

export default FieldPage;