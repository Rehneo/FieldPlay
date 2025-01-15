import City from "../interfaces/location/City.ts";
import React, {createContext, useState, useEffect} from "react";
import locationService from "../services/LocationService.ts";
import {DEFAULT_CITY} from "../config/constants.tsx";
import ServerErrorPage from "../pages/ServerErrorPage.tsx";

type CityContextType = {
    city: City | null;
    cities: City[];
    setCity: (city: City) => void;
};

type Props = { children: React.ReactNode };

const CityContext = createContext<CityContextType>({} as CityContextType);

export const CityProvider = ({children}: Props) => {
    const [city, setCity] = useState<City | null>(null);
    const [cities, setCities] = useState<City[]>([]);
    const [isReady, setIsReady] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const response = await locationService.getAllCities(); // Adjust endpoint
                setCities(response.data.content);
                const savedCity = localStorage.getItem("city");
                if (savedCity) {
                    setCity(JSON.parse(savedCity));
                } else {
                    setCity(DEFAULT_CITY);
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                setIsError(true);
            } finally {
                setIsReady(true);
            }
        })();
    }, []);

    useEffect(() => {
        if (city) {
            localStorage.setItem("city", JSON.stringify(city));
        }
    }, [city]);

    return (
        <CityContext.Provider
            value={{city, cities, setCity}}
        >
            {isReady
                ? isError ? <ServerErrorPage/> : children
                : null
            }
        </CityContext.Provider>
    );
};

export default CityContext;
