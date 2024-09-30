/**
 * This file was generated from ImageMarker.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ActionValue, DynamicValue, EditableValue, ListValue, ListAttributeValue, WebImage } from "mendix";
import { Big } from "big.js";

export interface ImageMarkerContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    image: DynamicValue<WebImage>;
    columns: number;
    rows: number;
    showGrid: boolean;
    showMarkUp: boolean;
    lowLimit?: EditableValue<Big>;
    highLimit?: EditableValue<Big>;
    data: ListValue;
    height: number;
    context?: ListValue;
    points: ListValue;
    xParentAttribute: EditableValue<Big>;
    yParentAttribute: EditableValue<Big>;
    xPointAttribute: ListAttributeValue<Big>;
    yPointAttribute: ListAttributeValue<Big>;
    colorAttribute: ListAttributeValue<string>;
    action?: ActionValue;
    pointSize: ListAttributeValue<Big>;
    pointColor: string;
    lineColor: string;
    lowColor: string;
    medColor: string;
    highColor: string;
}

export interface ImageMarkerPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    renderMode?: "design" | "xray" | "structure";
    image: { type: "static"; imageUrl: string; } | { type: "dynamic"; entity: string; } | null;
    columns: number | null;
    rows: number | null;
    showGrid: boolean;
    showMarkUp: boolean;
    lowLimit: string;
    highLimit: string;
    data: {} | { caption: string } | { type: string } | null;
    height: number | null;
    context: {} | { caption: string } | { type: string } | null;
    points: {} | { caption: string } | { type: string } | null;
    xParentAttribute: string;
    yParentAttribute: string;
    xPointAttribute: string;
    yPointAttribute: string;
    colorAttribute: string;
    action: {} | null;
    pointSize: string;
    pointColor: string;
    lineColor: string;
    lowColor: string;
    medColor: string;
    highColor: string;
}
