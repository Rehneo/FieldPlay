import "./BlackList.css"
import BlackListReadDto from "../../../interfaces/admin/BlackListReadDto.ts";
import React from "react";
import {DateTime} from "luxon";
import {Button} from "@mui/material";

interface BlackListBlockProps {
    blacklist: BlackListReadDto;
    onDelete: (blacklistId: number) => void;
}

const BlackListBlock: React.FC<BlackListBlockProps> = ({blacklist, onDelete}) => {
    return <div className="blacklist-block">
        <div className="blacklist-info">
            <div>
                <span>Имя пользователя: </span>
                <span className="font-bold">{blacklist.user.username}</span>
            </div>
            <div>
                <span>ID пользователя: </span>
                <span className="font-bold">{blacklist.user.id}</span>
            </div>
            <div>
                <span>Дата создания: </span>
                <span className="font-bold">{DateTime.fromISO(blacklist.createdAt.toString())
                    .toLocaleString(DateTime.DATETIME_MED)}</span>
            </div>
            <div className="font-bold mt-2">
                {blacklist.reason}
            </div>
        </div>
        <div className="blacklist-delete">
            <Button variant="contained" onClick={() => onDelete(blacklist.id)}>Удалить</Button>
        </div>
        <hr/>
    </div>
}

export default BlackListBlock;