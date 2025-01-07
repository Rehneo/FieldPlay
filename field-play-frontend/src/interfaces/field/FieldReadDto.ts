import {SurfaceType} from "./SurfaceType.ts";
import {FieldType} from "./FieldType.ts";
import MetroStation from "../location/MetroStation.ts";

export default interface FieldReadDto {
    id: number;
    name: string;
    stations: MetroStation[];
    address: string;
    surfaceType: SurfaceType;
    type: FieldType;
    avgRating: number;
}