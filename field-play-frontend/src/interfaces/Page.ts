import Pageable from "./Pageable";
import Sort from "./Sort";

export default interface Page<T> {
    totalElements: number;
    totalPages: number;
    pageable: Pageable;
    size: number;
    content: T[];
    number: number;
    sort: Sort;
    first?: boolean;
    last?: boolean;
    numberOfElements: 0;
    empty?: boolean;
}