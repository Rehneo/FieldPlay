import "./FieldDetails.css"
import FieldFullReadDto from "../../../interfaces/field/FieldFullReadDto.ts";
import React from "react";
import {getSurfaceTypeDisplay} from "../../../interfaces/field/SurfaceType.ts";
import {FieldType} from "../../../interfaces/field/FieldType.ts";
import starIcon from "../../../assets/star.svg";
import checkmarkIcon from "../../../assets/checkmark.svg";
import xmarkIcon from "../../../assets/xmark.svg";


interface FieldDetailsProps {
    field: FieldFullReadDto;
}

const FieldDetails: React.FC<FieldDetailsProps> = ({field}) => {

    return <div className="field-details">
        <label className="field-name-label">{field.name}</label>
        <hr className="field-name-line"/>
        <label className="field-address-label">{field.address}</label>

        <div className="field-details-container">
            <div className="field-photo-container">
                <label className="field-photo-label">Фото?</label>
            </div>
            <div className="field-info-container">
                <div className="mt-2 mb-4">
                    <span className="border-r border-black border-opacity-20 font-light p-2 pl-0">
                        {field.length} x {field.width} {field.height ? 'x' + field.height : ''}
                    </span>
                    <span
                        className="border-r border-black border-opacity-20 font-light p-2">
                        {getSurfaceTypeDisplay(field.surfaceType)}
                    </span>
                    <span
                        className="font-light p-2">
                        {field.type == FieldType.INDOOR ? 'Крытая' : 'Открытая'}
                    </span>
                </div>
                <hr className="border-black"/>
                <span className="mt-4 mb-4">до {field.maxPlayers} игроков</span>
                <hr className="border-black"/>
                <div className="mt-4 mb-4 flex flex-col gap-2">
                    <div className="flex flex-row justify-between">
                        <span>Раздевалки</span>
                        {field.lockerRoom
                            ? <img src={checkmarkIcon} className="w-5" alt="Checkmark Icon"/>
                            : <img src={xmarkIcon} className="w-5" alt="XMark Icon"/>
                        }
                    </div>
                    <div className="flex flex-row justify-between">
                        <span>Трибуны</span>
                        {field.stands
                            ? <img src={checkmarkIcon} className="w-5" alt="Checkmark Icon"/>
                            : <img src={xmarkIcon} className="w-5" alt="XMark Icon"/>
                        }
                    </div>
                    <div className="flex flex-row justify-between">
                        <span>Душ</span>
                        {field.shower
                            ? <img src={checkmarkIcon} className="w-5" alt="Checkmark Icon"/>
                            : <img src={xmarkIcon} className="w-5" alt="XMark Icon"/>
                        }
                    </div>
                    <div className="flex flex-row justify-between">
                        <span>Освещение</span>
                        {field.lighting
                            ? <img src={checkmarkIcon} className="w-5" alt="Checkmark Icon"/>
                            : <img src={xmarkIcon} className="w-5" alt="XMark Icon"/>
                        }
                    </div>
                    <div className="flex flex-row justify-between">
                        <span>Парковка</span>
                        {field.parkingSpace
                            ? <img src={checkmarkIcon} className="w-5" alt="Checkmark Icon"/>
                            : <img src={xmarkIcon} className="w-5" alt="XMark Icon"/>
                        }
                    </div>
                </div>
                <hr className="border-black"/>
                <div className="mt-4 mb-4 flex flex-row gap-2">
                    <img src={starIcon} className="w-5" alt="Star Icon"/>
                    <span>{field.avgRating ? field.avgRating : '-'}</span>
                </div>
            </div>
        </div>
    </div>

}

export default FieldDetails;