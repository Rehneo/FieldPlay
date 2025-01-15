import apiService from "./ApiService.ts";
import City from "../interfaces/location/City.ts";
import {AxiosResponse} from "axios";
import Page from "../interfaces/Page.ts";

class LocationService {

    getAllCities = async (): Promise<AxiosResponse<Page<City>>> => {
        return apiService.get<Page<City>>('/cities');
    }
}

const locationService = new LocationService();
export default locationService;