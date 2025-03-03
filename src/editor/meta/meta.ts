export type PropertyType = {
    type: 'number' | 'boolean' | 'color' | 'material' | 'distanceDisplayCondition';
} | {
    type: 'enum';
    enum: any;
    ignore?: string[];
};

export type PropertyMeta = {
    name: string;
    title?: string;
    description?: string;
} & PropertyType;

export const heightReferenceDescription = `
NONE - The position is absolute.
CLAMP_TO_GROUND - The position is clamped to the terrain and 3D Tiles.
RELATIVE_TO_GROUND - The position height is the height above the terrain and 3D Tiles.
CLAMP_TO_TERRAIN - The position is clamped to terain.
RELATIVE_TO_TERRAIN - The position height is the height above terrain.
CLAMP_TO_3D_TILE - The position is clamped to 3D Tiles.
RELATIVE_TO_3D_TILE - The position height is the height above 3D Tiles.
`;