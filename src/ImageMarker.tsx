import { ReactElement, createElement } from "react";
import { Canvas } from "./components/Canvas";
import { ValueStatus } from "mendix";

import { ImageMarkerContainerProps } from "../typings/ImageMarkerProps";

import "./ui/Imagemarker.css";

export function ImageMarker({
    image,
    columns,
    rows,
    lineColor,
    lowColor,
    medColor,
    highColor,
    lowLimit,
    highLimit,
    showGrid,
    showMarkUp,
    height,
    xParentAttribute,
    yParentAttribute,
    points,
    xPointAttribute,
    yPointAttribute,
    colorAttribute,
    action,
    pointSize
}: ImageMarkerContainerProps): ReactElement {
    return (
        <div>
            {image.status === ValueStatus.Available && image.value && (
                <Canvas
                    imageuri={image.value.uri}
                    columns={columns}
                    rows={rows}
                    lineColor={lineColor}
                    lowColor={lowColor}
                    medColor={medColor}
                    highColor={highColor}
                    lowLimit={lowLimit}
                    highLimit={highLimit}
                    showGrid={showGrid}
                    showMarkUp={showMarkUp}
                    points={points}
                    height={height}
                    xParentAttribute={xParentAttribute}
                    yParentAttribute={yParentAttribute}
                    xPointAttribute={xPointAttribute}
                    yPointAttribute={yPointAttribute}
                    colorAttribute={colorAttribute}
                    action={action}
                    pointSize={pointSize}
                />
            )}
        </div>
    );
}
