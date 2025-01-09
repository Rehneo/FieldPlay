import UserFieldView from "../../components/field/FieldView/UserFieldView.tsx";
import "./FieldSelectionPage.css"
import Header from "../../components/header/Header.tsx";

const FieldSelectionPage = () => {


    return <div className="field-select-container">
        <Header/>
        <UserFieldView/>
    </div>
}

export default FieldSelectionPage;