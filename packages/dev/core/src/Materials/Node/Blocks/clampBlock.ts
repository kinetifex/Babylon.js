import { NodeMaterialBlock } from "../nodeMaterialBlock";
import { NodeMaterialBlockConnectionPointTypes } from "../Enums/nodeMaterialBlockConnectionPointTypes";
import type { NodeMaterialBuildState } from "../nodeMaterialBuildState";
import type { NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint";
import { NodeMaterialBlockTargets } from "../Enums/nodeMaterialBlockTargets";
import { RegisterClass } from "../../../Misc/typeStore";
import type { Scene } from "../../../scene";
import { editableInPropertyPage, PropertyTypeForEdition } from "../../../Decorators/nodeDecorator";

/**
 * Block used to clamp a float
 */
export class ClampBlock extends NodeMaterialBlock {
    /** Gets or sets the minimum range */
    @editableInPropertyPage("Minimum", PropertyTypeForEdition.Float)
    public minimum = 0.0;
    /** Gets or sets the maximum range */
    @editableInPropertyPage("Maximum", PropertyTypeForEdition.Float)
    public maximum = 1.0;

    /**
     * Creates a new ClampBlock
     * @param name defines the block name
     */
    public constructor(name: string) {
        super(name, NodeMaterialBlockTargets.Neutral);

        this.registerInput("value", NodeMaterialBlockConnectionPointTypes.AutoDetect);
        this.registerOutput("output", NodeMaterialBlockConnectionPointTypes.BasedOnInput);

        this._outputs[0]._typeConnectionSource = this._inputs[0];
    }

    /**
     * Gets the current class name
     * @returns the class name
     */
    public getClassName() {
        return "ClampBlock";
    }

    /**
     * Gets the value input component
     */
    public get value(): NodeMaterialConnectionPoint {
        return this._inputs[0];
    }

    /**
     * Gets the output component
     */
    public get output(): NodeMaterialConnectionPoint {
        return this._outputs[0];
    }

    protected _buildBlock(state: NodeMaterialBuildState) {
        super._buildBlock(state);

        const output = this._outputs[0];

        state.compilationString +=
            state._declareOutput(output) + ` = clamp(${this.value.associatedVariableName}, ${this._writeFloat(this.minimum)}, ${this._writeFloat(this.maximum)});\n`;

        return this;
    }

    protected _dumpPropertiesCode() {
        let codeString = super._dumpPropertiesCode() + `${this._codeVariableName}.minimum = ${this.minimum};\n`;

        codeString += `${this._codeVariableName}.maximum = ${this.maximum};\n`;

        return codeString;
    }

    public serialize(): any {
        const serializationObject = super.serialize();

        serializationObject.minimum = this.minimum;
        serializationObject.maximum = this.maximum;

        return serializationObject;
    }

    public _deserialize(serializationObject: any, scene: Scene, rootUrl: string) {
        super._deserialize(serializationObject, scene, rootUrl);

        this.minimum = serializationObject.minimum;
        this.maximum = serializationObject.maximum;
    }
}

RegisterClass("BABYLON.ClampBlock", ClampBlock);
