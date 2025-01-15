import {FieldType} from "./FieldType.ts";
import {SurfaceType} from "./SurfaceType.ts";

export default interface FieldCreateEditDto {
    name: string;
    address: string;
    type: FieldType;
    surfaceType: SurfaceType;
    maxPlayers: string;
    length: string;
    width: string;
    height?: string;
    lockerRoom: boolean;
    stands: boolean;
    shower: boolean;
    lighting: boolean;
    parkingSpace: boolean;
    cityId: number;
    companyId: number;
}