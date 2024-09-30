/* eslint-disable @typescript-eslint/no-empty-function */
import { ReactElement, createElement, useRef, useEffect, useState, MouseEvent } from "react";
import { ListValue, EditableValue, ListAttributeValue, ActionValue } from "mendix";
import { hexToRGBA, cssColorToRGBA } from "src/utilities/ColourManagement";
import { getNumberFromEditableValue } from "src/utilities/NumberManagement";
import Big from "big.js";

export interface CanvasProps {
    imageuri: string;
    columns: number;
    rows: number;
    lineColor: string;
    lowColor: string;
    medColor: string;
    highColor: string;
    lowLimit: EditableValue<Big> | undefined;
    highLimit: EditableValue<Big> | undefined;
    showGrid: boolean;
    showMarkUp: boolean;
    height: number;
    points: ListValue | undefined;
    xParentAttribute: EditableValue<Big>;
    yParentAttribute: EditableValue<Big>;
    xPointAttribute: ListAttributeValue<Big> | undefined;
    yPointAttribute: ListAttributeValue<Big> | undefined;
    colorAttribute: ListAttributeValue<string> | undefined;
    action: ActionValue | undefined;
    pointSize: ListAttributeValue<Big> | undefined;
}

export const Canvas = (props: CanvasProps): ReactElement => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);

    const {
        imageuri,
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
        action,
        colorAttribute,
        pointSize
    } = props;

    // const [points, setPoints] = useState<Point[]>([]);
    const [initialLoad, setInitialLoad] = useState(true);
    const [lowLimitState, setLowLimitState] = useState(0);
    const [highLimitState, setHighLimitState] = useState(0);

    useEffect(() => {
        // Initialize
        const imgElement = imgRef.current!;
        canvasCtxRef.current = canvasRef.current!.getContext("2d");
        const ctx = canvasCtxRef.current!;
        imgElement.onload = () => {
            const imgAspect = imgElement.naturalWidth / imgElement.naturalHeight;
            imgElement.height = height;
            imgElement.width = imgElement.height * imgAspect;
            redraw(ctx, imgElement);
        };
    }, [initialLoad]);

    useEffect(() => {
        // Initialize
        if (canvasRef.current) {
            canvasCtxRef.current = canvasRef.current.getContext("2d");
            const ctx = canvasCtxRef.current!;
            const imgElement = imgRef.current!;
            ctx!.clearRect(0, 0, ctx!.canvas.width, ctx!.canvas.height);

            setLowLimitState (getNumberFromEditableValue(lowLimit))
            setHighLimitState (getNumberFromEditableValue(highLimit))

            redraw(ctx, imgElement);
        }
    }, [points, lowLimit, highLimit]);

    const redraw = (ctx: CanvasRenderingContext2D, imgElement: HTMLImageElement): void => {
        console.log ('Redrawn')
        ctx.canvas.width = imgElement.width;
        ctx.canvas.height = imgElement.height;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(imgElement, 0, 0, ctx.canvas.width, ctx.canvas.height);
        drawPoints(ctx);
        if (showGrid) {
            drawBoxes(ctx, columns, rows);
        }
        if (showMarkUp && lowLimit != undefined && highLimit != undefined) {
            drawGrids(ctx, columns, rows);
        }
        if (initialLoad) {
            setInitialLoad(false);
        }
    };

    const addPointClick = (event: MouseEvent<HTMLCanvasElement>): void => {
        event.preventDefault();
        if (canvasRef.current) {
            const node = canvasRef.current;
            const rect = node.getBoundingClientRect();

            const x = new Big(Math.floor(event.clientX - rect.left));
            const y = new Big(Math.floor(event.clientY - rect.top));

            yParentAttribute.setValue(y);
            xParentAttribute.setValue(x);

            if (action && action.canExecute) {
                action.execute();
            }
        }
    };

    const drawPoints = (ctx: CanvasRenderingContext2D): void => {
        // radius
        if (points && points.items) {
            points.items.forEach(p => {
                if (xPointAttribute && yPointAttribute) {
                    const x = xPointAttribute.get(p).value?.toNumber();
                    const y = yPointAttribute.get(p).value?.toNumber();
                    let pointColor = "black";
                    if (colorAttribute) {
                        pointColor = colorAttribute.get(p).displayValue ? colorAttribute.get(p).displayValue : "black";
                    }
                    let pointRadius = 5;
                    if (pointSize) {
                        const obj = pointSize.get(p);
                        const pointSizeValue = obj.value!;
                        pointRadius = pointSizeValue.toNumber() / 2;
                    }
                    if (x && y) {
                        ctx!.beginPath();
                        ctx!.arc(x, y, pointRadius, 0, 2 * Math.PI, false);
                        ctx!.fillStyle = pointColor;
                        ctx!.strokeStyle = pointColor;
                        ctx!.fill();
                        ctx!.stroke();
                    } else {
                        console.error("x or y is undefined");
                    }
                }
            });
        }
    };

    const drawBoxes = (ctx: CanvasRenderingContext2D, columns: number, rows: number): void => {
        const imgElement = imgRef.current!;
        const columnSize = imgElement.width / columns;
        const rowSize = imgElement.height / rows;

        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                let x1 = i * columnSize;
                let y1 = 0;
                const y2 = imgElement.height;

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x1, y2);
                ctx.strokeStyle = lineColor!;
                ctx.stroke();

                x1 = 0;
                y1 = j * rowSize;
                const x2 = imgElement.width;

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y1);
                ctx.strokeStyle = lineColor!;
                ctx.stroke();
            }
        }
    };

    const drawGrids = (ctx: CanvasRenderingContext2D, columns: number, rows: number): void => {
        const imgElement = imgRef.current!;
        const columnSize = imgElement.width / columns;
        const rowSize = imgElement.height / rows;

     // create the matrix
     const errorMatrix = new Array(columns).fill(0).map(() => new Array(rows).fill(0));

     // map the points to the matrix
     if (points && points.items) {
         points.items.forEach(p => {
             const x = xPointAttribute!.get(p).value?.toNumber();
             const y = yPointAttribute!.get(p).value?.toNumber();
             if (x !== undefined && y !== undefined) {
                 const boxX = Math.floor(x / columnSize);
                 const boxY = Math.floor(y / rowSize);
                 if (boxX >= 0 && boxX < columns && boxY >= 0 && boxY < rows) {
                     errorMatrix[boxX][boxY] += 1;
                 }
             }
         });
     }

     // draw the rectangles based on the error matrix
     for (let i = 0; i < columns; i++) {
         for (let j = 0; j < rows; j++) {
            // Define the base color and opacity
            let baseColor = lowColor!;
            let opacity = 0.3;

            // Update the color based on errorMatrix count
            if (errorMatrix[i][j] > 0 && errorMatrix[i][j] >= lowLimitState && errorMatrix[i][j] < highLimitState) {
                baseColor = medColor!;
            } else if (errorMatrix[i][j] >= highLimitState) {
                baseColor = highColor!;
            }

            // Convert the baseColor to rgba with opacity
            ctx.fillStyle = baseColor.startsWith('#') 
                ? hexToRGBA(baseColor, opacity)
                : cssColorToRGBA(baseColor, opacity);

            // Draw the rectangle
            ctx.fillRect(i * columnSize, j * rowSize, columnSize, rowSize);
         }
     }
    };


    return (
        <div>
            <canvas ref={canvasRef} onClick={addPointClick} />
            {/* <div className="btnContainer">
                <button className="btn mx-button btn-primary spacing-outer-right" onClick={saveImage}>
                    Save
                </button>
                <button className="btn mx-button btn-default" onClick={clearPoints}>
                    Reset
                </button>
            </div> */}
            <img ref={imgRef} src={imageuri} style={{ visibility: "hidden", position: "absolute" }} />
        </div>
    );
};
