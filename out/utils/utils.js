"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMarkup = exports.renderPairs = exports.parseContent = void 0;
/**
 * Function that returns the test name and the snapshot html
 * @param content content from the vs code editor
 * example: "exports[`test1`] = `html1`    exports[`test2`] = `html2`"
 * returns: [ { key:test1,value:html1 },{ key:test2,value:html2 } ]
 */
const parseContent = (content) => {
    const regex = /exports/;
    const splitContent = content?.split(regex).filter(content => content);
    const toRenderPairs = splitContent.map(sc => {
        const regex1 = /\[(.*?)\]\s?=/;
        const subContent = sc.split(regex1).filter(c => c).map(c => c.trim()) || [];
        if (subContent.length < 2) {
            return;
        }
        return {
            // remove the quotes
            key: subContent[0]?.replace(/[`"]+/g, ''),
            // Remove semicolon at the end
            value: subContent[1]?.replace(/;$/, '').replace(/[`"]+/g, '')
        };
    }).filter(f => f);
    return toRenderPairs;
};
exports.parseContent = parseContent;
/**
 * Created html markup for snapshot
 * @param pairs array of objects with key and value
 */
const renderPairs = (pairs) => {
    const markup = pairs.map(pair => {
        return `
            <div>
                <h1 style="background-color=antiquewhite">${pair.key}</h1>
                <div style="background-color=aliceblue"> ${pair.value}</div>
            </div>
        `;
    }).join('\n\n\n');
    return markup;
};
exports.renderPairs = renderPairs;
/**
 * Function that returns the html doc
 * @param content content from the vs code editor
 * @returns html markup
 */
const generateMarkup = (content) => {
    const getTestPairs = (0, exports.parseContent)(content);
    const getTestPairsHtml = (0, exports.renderPairs)(getTestPairs);
    return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cat Coding</title>
        </head>
        <body> 
            ${getTestPairsHtml}
        </body>
        </html>`;
};
exports.generateMarkup = generateMarkup;
//# sourceMappingURL=utils.js.map