import FieldReadDto from "../../../interfaces/field/FieldReadDto.ts";
import FieldBlock from "../FieldBlock/FieldBlock.tsx";
import React from "react";
import "./FieldBlockContainer.css"
import {useNavigate} from "react-router-dom";

interface FieldBlockContainerProps {
    fields: FieldReadDto[];
}


const FieldBlockContainer: React.FC<FieldBlockContainerProps> = ({fields}) => {
    const navigate = useNavigate();
    return <div className="field-block-container">
        {fields.map((field) => {
            return <div onClick={() => navigate(`/fields/${field.id}`)}>
                <FieldBlock key={field.id} field={field}/>
            </div>
        })}
    </div>
}

export default FieldBlockContainer;