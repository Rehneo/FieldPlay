import UserFieldView from "../../components/field/FieldView/UserFieldView.tsx";
import "./FieldSelectionPage.css"
import UserHeader from "../../components/header/UserHeader/UserHeader.tsx";

const FieldSelectionPage = () => {


    return <div className="field-select-container">
        <UserHeader/>
        <UserFieldView/>
    </div>
}

export default FieldSelectionPage;