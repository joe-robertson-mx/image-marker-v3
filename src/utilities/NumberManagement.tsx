import { EditableValue, ValueStatus } from "mendix";

export function getNumberFromEditableValue(editableValue: EditableValue<Big> | undefined): number {
    if (!editableValue || editableValue.status !== ValueStatus.Available) {
        console.warn("EditableValue is either undefined, null, or not available.");
        return NaN; // Default value for unavailable or invalid EditableValue
    }

    const value = editableValue.value;

    // Return NaN if the value is undefined, null, or not convertible to a number
    if (value === undefined || value === null) {
        console.warn("EditableValue's value is undefined or null.");
        return NaN;
    }

    // Attempt to convert the Big value to a number
    const numberValue = Number(value.toString());

    if (isNaN(numberValue)) {
        console.warn("Conversion resulted in NaN.");
        return NaN;
    }

    return numberValue;
}
