import {useParams} from "react-router-dom";
import FieldDetails from "../../components/field/FieldDetails/FieldDetails.tsx";
import {SurfaceType} from "../../interfaces/field/SurfaceType.ts";
import {FieldType} from "../../interfaces/field/FieldType.ts";
import Header from "../../components/header/Header.tsx";
import "./FieldPage.css"


const FieldPage = () => {
    const {fieldId} = useParams();
    return <div className="field-page-container">
        <Header/>
        <FieldDetails field={
            {
                id:fieldId,
                name: 'Маршал Арена',
                surfaceType: SurfaceType.ARTIFICIAL,
                type: FieldType.INDOOR,
                address: 'пр-т М. Тореза, д. 71а',
                avgRating: 5,
                maxPlayers: 20,
                length: 25,
                width: 20,
                height: 30,
                lockerRoom: true,
                stands: false,
                shower: true,
                lighting: true,
                parkingSpace: true,
            }} />
    </div>
}

export default FieldPage;