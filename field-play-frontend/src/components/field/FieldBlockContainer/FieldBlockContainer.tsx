import FieldReadDto from "../../../interfaces/field/FieldReadDto.ts";
import FieldBlock from "../FieldBlock/FieldBlock.tsx";
import React from "react";
import "./FieldBlockContainer.css"

interface FieldBlockContainerProps {
    fields: FieldReadDto[];
    onNavigate: (fieldId: number) => void;
}


const FieldBlockContainer: React.FC<FieldBlockContainerProps> = ({fields, onNavigate}) => {
    return <div className="field-block-container">
        {fields.map((field) => {
            return <div key={field.id} onClick={() => onNavigate(field.id)}>
                <FieldBlock key={field.id} field={field}/>
            </div>
        })}
    </div>
}

export default FieldBlockContainer;