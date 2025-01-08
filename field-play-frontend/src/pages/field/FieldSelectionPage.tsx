import FieldFilter from "../../components/field/FieldFilter/FieldFilter.tsx";
import SearchRequest from "../../interfaces/search/SearchRequest.ts";
import {useEffect, useState} from "react";


const FieldSelectionPage = () => {
    const [searchRequest, setSearchRequest] = useState<SearchRequest>({list: []})

    useEffect(() => {
        console.log(searchRequest)
    },[searchRequest])
    return <div>
        <FieldFilter onApply = {setSearchRequest}/>
    </div>
}

export default FieldSelectionPage;