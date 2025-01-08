import FieldReadDto from "../../../interfaces/field/FieldReadDto.ts";
import FieldBlock from "../FieldBlock/FieldBlock.tsx";
import React from "react";
import "./FieldBlockContainer.css"

interface FieldBlockContainerProps {
    fields: FieldReadDto[];
}


const FieldBlockContainer: React.FC<FieldBlockContainerProps> = ({fields}) => {
    return <div className="field-block-container">
        {fields.map((field) => {
            return <FieldBlock key={field.id} field={field}/>
        })}
    </div>
}

export default FieldBlockContainer;