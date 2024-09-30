import { ReactElement, createElement } from "react";
import { ImageMarkerPreviewProps } from "../typings/ImageMarkerProps";

import "./ui/Imagemarker.css";

export function preview({
    class: className,
    style,
    styleObject,
    image,
    columns,
    rows,
    lineColor
}: ImageMarkerPreviewProps): ReactElement {
    const imageUrl = image && image.type === "static" ? image.imageUrl : "/api/placeholder/400/320";

    const gridStyle: React.CSSProperties = {
        backgroundImage: `
            linear-gradient(to right, ${lineColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)
        `,
        backgroundSize: `${100 / (columns ?? 3)}% ${100 / (rows ?? 3)}%`,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    };

    return (
        <div 
            className={className} 
            style={{
                ...styleObject,
                ...JSON.parse(style || "{}"),
                position: 'relative',
                height: '500px',
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <div style={gridStyle}></div>
        </div>
    );
}

export function getPreviewCss(): string {
    return require("./ui/Imagemarker.css");
}