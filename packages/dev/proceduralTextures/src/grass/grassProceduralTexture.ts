import { serializeAsColor3 } from "core/Misc/decorators";
import { SerializationHelper } from "core/Misc/decorators.serialization";
import { Color3 } from "core/Maths/math.color";
import type { Texture } from "core/Materials/Textures/texture";
import { ProceduralTexture } from "core/Materials/Textures/Procedurals/proceduralTexture";
import type { Scene } from "core/scene";
import { RegisterClass } from "core/Misc/typeStore";
import type { Nullable } from "core/types";

import "./grassProceduralTexture.fragment";

export class GrassProceduralTexture extends ProceduralTexture {
    private _grassColors: Color3[];
    private _groundColor = new Color3(1, 1, 1);

    constructor(name: string, size: number, scene: Nullable<Scene> = null, fallbackTexture?: Texture, generateMipMaps?: boolean) {
        super(name, size, "grassProceduralTexture", scene, fallbackTexture, generateMipMaps);

        this._grassColors = [new Color3(0.29, 0.38, 0.02), new Color3(0.36, 0.49, 0.09), new Color3(0.51, 0.6, 0.28)];

        this.updateShaderUniforms();
    }

    public updateShaderUniforms() {
        this.setColor3("herb1Color", this._grassColors[0]);
        this.setColor3("herb2Color", this._grassColors[1]);
        this.setColor3("herb3Color", this._grassColors[2]);
        this.setColor3("groundColor", this._groundColor);
    }

    public get grassColors(): Color3[] {
        return this._grassColors;
    }

    public set grassColors(value: Color3[]) {
        this._grassColors = value;
        this.updateShaderUniforms();
    }

    @serializeAsColor3()
    public get groundColor(): Color3 {
        return this._groundColor;
    }

    public set groundColor(value: Color3) {
        this._groundColor = value;
        this.updateShaderUniforms();
    }

    /**
     * Serializes this grass procedural texture
     * @returns a serialized grass procedural texture object
     */
    public serialize(): any {
        const serializationObject = SerializationHelper.Serialize(this, super.serialize());
        serializationObject.customType = "BABYLON.GrassProceduralTexture";

        serializationObject.grassColors = [];
        for (let i = 0; i < this._grassColors.length; i++) {
            serializationObject.grassColors.push(this._grassColors[i].asArray());
        }

        return serializationObject;
    }

    /**
     * Creates a Grass Procedural Texture from parsed grass procedural texture data
     * @param parsedTexture defines parsed texture data
     * @param scene defines the current scene
     * @param rootUrl defines the root URL containing grass procedural texture information
     * @returns a parsed Grass Procedural Texture
     */
    public static Parse(parsedTexture: any, scene: Scene, rootUrl: string): GrassProceduralTexture {
        const texture = SerializationHelper.Parse(
            () => new GrassProceduralTexture(parsedTexture.name, parsedTexture._size, scene, undefined, parsedTexture._generateMipMaps),
            parsedTexture,
            scene,
            rootUrl
        );

        const colors: Color3[] = [];
        for (let i = 0; i < parsedTexture.grassColors.length; i++) {
            colors.push(Color3.FromArray(parsedTexture.grassColors[i]));
        }

        texture.grassColors = colors;

        return texture;
    }
}

RegisterClass("BABYLON.GrassProceduralTexture", GrassProceduralTexture);
