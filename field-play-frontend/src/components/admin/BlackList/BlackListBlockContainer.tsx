import BlackListReadDto from "../../../interfaces/admin/BlackListReadDto.ts";
import React from "react";
import BlackListBlock from "./BlackListBlock.tsx";

interface BlackListBlockContainerProps {
    blacklists: BlackListReadDto[];
    onDelete: (blackListId: number) => void;
}

const BlackListBlockContainer: React.FC<BlackListBlockContainerProps> = ({blacklists, onDelete}) => {
    return <div className="blacklist-block-container">
        {blacklists.map((blacklist) => {
            return <BlackListBlock key={blacklist.id}
                                   blacklist={blacklist}
                                   onDelete={onDelete}
            />
        })}
    </div>
}

export default BlackListBlockContainer;