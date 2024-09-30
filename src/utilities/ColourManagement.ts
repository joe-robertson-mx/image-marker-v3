export const hexToRGBA = (hex: string, opacity: number): string => {
    let r = 0, g = 0, b = 0;

    // Handle 3-digit hex (#RGB)
    if (hex.length == 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    }
    // Handle 6-digit hex (#RRGGBB)
    else if (hex.length == 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const cssColorToRGBA = (cssColor: string, opacity: number): string => {
    // Create a dummy element to leverage the browser’s ability to parse CSS colors
    const tempElement = document.createElement('div');
    tempElement.style.color = cssColor;
    document.body.appendChild(tempElement);

    // Get the computed RGB color
    const computedColor = getComputedStyle(tempElement).color;
    document.body.removeChild(tempElement);

    // Extract the RGB values and add the opacity
    const rgbValues = computedColor.match(/\d+/g);
    if (rgbValues) {
        const [r, g, b] = rgbValues;
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    // Default to black if parsing fails
    return `rgba(0, 0, 0, ${opacity})`;
};
