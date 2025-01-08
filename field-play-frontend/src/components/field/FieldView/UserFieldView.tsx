import {useState} from "react";
import SearchRequest from "../../../interfaces/search/SearchRequest.ts";
import FieldFilter from "../FieldFilter/FieldFilter.tsx";
import FieldBlockContainer from "../FieldBlockContainer/FieldBlockContainer.tsx";
import FieldReadDto from "../../../interfaces/field/FieldReadDto.ts";
import PaginationState from "../../../interfaces/PaginationState.ts";
import "./FieldView.css"

const UserFieldView = (() => {

    const [searchRequest, setSearchRequest] = useState<SearchRequest>({list: []})
    const [fields, setFields] = useState<FieldReadDto[]>([])
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 9,
    });


    return <div className="field-view-container">
        <span className="field-select-label">Выберите поле</span>
        <FieldFilter onApply={setSearchRequest}/>
        <FieldBlockContainer fields={fields}/>
    </div>

})

export default UserFieldView;