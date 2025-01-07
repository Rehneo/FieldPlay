import {SearchOperator} from "./SearchOperator.ts";

export default interface SearchCriteria {
    key: string;
    value: string | unknown;
    operator: SearchOperator;
}