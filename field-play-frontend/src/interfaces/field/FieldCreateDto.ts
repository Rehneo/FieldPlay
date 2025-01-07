import {FieldType} from "./FieldType.ts";
import {SurfaceType} from "./SurfaceType.ts";

export default interface FieldCreateDto {
    name: string;
    stationIds?: number[];
    address: string;
    type: FieldType;
    surfaceType: SurfaceType;
    maxPlayers: number;
    length: number;
    width: number
    height?: number;
    lockerRoom: boolean;
    stands: boolean;
    shower: boolean;
    lighting: boolean;
    parkingSpace: boolean;
    cityId: number;
    companyId: number;
}