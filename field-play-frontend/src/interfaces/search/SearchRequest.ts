import SearchCriteria from "./SearchCriteria.ts";

export default interface SearchRequest {
    criteriaList: SearchCriteria[];
}