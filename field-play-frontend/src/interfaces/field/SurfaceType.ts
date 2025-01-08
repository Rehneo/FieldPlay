export enum SurfaceType {
    NATURAL = 'NATURAL',
    ARTIFICIAL = 'ARTIFICIAL',
    PARQUET = 'PARQUET',
    LINOLEUM = 'LINOLEUM',
}

export const getSurfaceTypeDisplay = (surfaceType: SurfaceType | string) => {
    switch (surfaceType) {
        case SurfaceType.NATURAL:
            return "Трава";
        case SurfaceType.ARTIFICIAL:
            return "Искусственная трава";
        case SurfaceType.PARQUET:
            return "Паркет";
        case SurfaceType.LINOLEUM:
            return "Линолеум";
    }
};