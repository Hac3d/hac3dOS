// libs/errorHandler.js
// handles errors system-wide.

// example usage:

// import { SendError } from "../libs/errorHandler.js";
// SendError({
//     print,
//     terminal,
//     errorType: "ErrorTypeHere",
//     errorDisplayName: customVariable,
//     errorDetails: `'${customVariable}' is dumb lmaoooo`
// });

export function SendError({ print, terminal, errorType, errorDisplayName, errorDetails }) {

    print(`<span class="textColorRed">⚠</span> ${errorDetails} <span class="textColorGray">[${errorType}]</span><br>`);
    console.error(`⚠ ${errorDetails} [${errorType}]`)

}

export function ReturnErr_(errorType, errorDetails) {

    return `<span class="textColorRed">⚠</span> ${errorDetails} <span class="textColorGray">[${errorType}]</span><br>`

}