import MetroStation from "../location/MetroStation.ts";
import {SurfaceType} from "./SurfaceType.ts";
import {FieldType} from "./FieldType.ts";

export default interface FieldFullReadDto {
    id: number;
    name: string;
    stations?: MetroStation[];
    address: string;
    surfaceType: SurfaceType;
    type: FieldType;
    avgRating: number;
    maxPlayers: number;
    length: number;
    width: number;
    height?: number;
    lockerRoom: boolean;
    stands: boolean;
    shower: boolean;
    lighting: boolean;
    parkingSpace: boolean;
}