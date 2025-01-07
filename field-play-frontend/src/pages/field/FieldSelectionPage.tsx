import FieldBlock from "../../components/field/FieldBlock/FieldBlock.tsx";
import {SurfaceType} from "../../interfaces/field/SurfaceType.ts";
import {FieldType} from "../../interfaces/field/FieldType.ts";

const FieldSelectionPage = () => {
    return <div style={{
        width: '1320px',
        height: '610px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        alignContent: 'flex-start',
        gap: '20px 30px',
        backgroundColor: '#f0f0f0',
    }}>
        <FieldBlock id={1}
                    name='Озерки Арена'
                    stations={[{id: 1, name: 'Удельная'}, {id: 2, name: 'Озерки'}]}
                    address='пр-т М. Тореза, д. 71а'
                    surfaceType={SurfaceType.ARTIFICIAL}
                    type={FieldType.INDOOR}
                    avgRating={5}/>
        <FieldBlock id={1}
                    name='Озерки Арена'
                    stations={[{id: 1, name: 'Удельная'}, {id: 2, name: 'Озерки'}]}
                    address='пр-т М. Тореза, д. 71а'
                    surfaceType={SurfaceType.ARTIFICIAL}
                    type={FieldType.INDOOR}
                    avgRating={5}/>
        <FieldBlock id={1}
                    name='Озерки Арена'
                    stations={[{id: 1, name: 'Удельная'}, {id: 2, name: 'Озерки'}]}
                    address='пр-т М. Тореза, д. 71а'
                    surfaceType={SurfaceType.ARTIFICIAL}
                    type={FieldType.INDOOR}
                    avgRating={5}/>
    </div>
}

export default FieldSelectionPage;