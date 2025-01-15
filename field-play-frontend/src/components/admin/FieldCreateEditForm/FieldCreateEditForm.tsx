import {useState} from "react";
import {FieldType} from "../../../interfaces/field/FieldType.ts";
import {SurfaceType} from "../../../interfaces/field/SurfaceType.ts";
import FieldCreateEditDto from "../../../interfaces/field/FieldCreateEditDto.ts";

interface FieldCreateEditFormProps {
    onSubmit: (field: FieldCreateEditDto) => void;
    open: boolean;
    onClose: () => void;
    cityId: number;
    companyId: number;
}

const FieldCreateForm = ({cityId, companyId}: FieldCreateEditFormProps) => {
    const [formData, setFormData] = useState<FieldCreateEditDto>({
        name: "",
        address: "",
        type: FieldType.OUTDOOR,
        surfaceType: SurfaceType.ARTIFICIAL,
        maxPlayers: 0,
        length: 0,
        width: 0,
        height: undefined,
        lockerRoom: false,
        stands: false,
        shower: false,
        lighting: false,
        parkingSpace: false,
        cityId: cityId,
        companyId: companyId
    });
    const [validationErrors, setValidationErrors] = useState<
        Record<string, string | undefined>
    >({});

}

export default FieldCreateForm;