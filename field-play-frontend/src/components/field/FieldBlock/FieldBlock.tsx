import "./FieldBlock.css";
import FieldReadDto from "../../../interfaces/field/FieldReadDto.ts";
import {SurfaceType} from "../../../interfaces/field/SurfaceType.ts";
import metroIcon from '../../../assets/metro.svg'
import fieldIcon from '../../../assets/field.svg'
import addressIcon from '../../../assets/address.svg'
import starIcon from '../../../assets/star.svg'
import React from "react";

interface FieldBlockProps {
    field: FieldReadDto;
}

const FieldBlock: React.FC<FieldBlockProps> = ({field}) => {

    const getSurfaceTypeDisplay = (surfaceType: SurfaceType) => {
        switch (surfaceType) {
            case SurfaceType.NATURAL:
                return "Трава";
            case SurfaceType.ARTIFICIAL:
                return "Искусственная трава";
            case SurfaceType.PARQUET:
                return "Паркет";
            case SurfaceType.LINOLEUM:
                return "Линолеум";
        }
    };

    return (
        <div className="field-block">
            <div className="image-container">
            </div>
            <div className="info-container">
                <h3>{field.name}</h3>
                <div className="details">
                    <div className="detail">
                        <img src={addressIcon} className="icon" alt="Address Icon"/>
                        <span>{field.address}</span>
                    </div>
                    <div className="detail">
                        <img src={fieldIcon} className="icon" alt="Field Icon"/>
                        <span>{getSurfaceTypeDisplay(field.surfaceType)}</span>
                    </div>
                    <div className="detail">
                        <img src={metroIcon} className="icon" alt="Metro Icon"/>
                        <span>{field.stations[0].name}</span>
                    </div>
                </div>
                <div className="rating detail">
                    <img src={starIcon} className="icon" alt="Star Icon"/>
                    <span>{field.avgRating ? field.avgRating : '-'}</span>
                </div>
            </div>
        </div>
    );
};

export default FieldBlock;
