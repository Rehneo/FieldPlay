import apiService from "./ApiService.ts";
import City from "../interfaces/location/City.ts";
import {AxiosResponse} from "axios";
import Page from "../interfaces/Page.ts";
import MetroStation from "../interfaces/location/MetroStation.ts";

class LocationService {

    getAllCities = async (): Promise<AxiosResponse<Page<City>>> => {
        return apiService.get<Page<City>>('/cities');
    }

    getAllStations = async (cityId: number): Promise<AxiosResponse<Page<MetroStation>>> => {
        return apiService.get<Page<MetroStation>>(`/metro-stations?cityId=${cityId}`);
    }
}

const locationService = new LocationService();
export default locationService;