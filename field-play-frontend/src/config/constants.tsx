import City from "../interfaces/location/City.ts";

export const API_URL = import.meta.env.VITE_API_URL;
export const UNHANDLED_ERROR_MESSAGE = "Произошла ошибка, повторите попытку позднее";
export const DAYS_IN_WEEK = 7;
export const SESSION_TABLE_ROWS = 24;
export const PAGE_SIZE = 6;
export const FIELD_PAGE_SIZE = 9;
export const DEFAULT_CITY = {id: 1, name: 'Санкт-Петербург'} as City;