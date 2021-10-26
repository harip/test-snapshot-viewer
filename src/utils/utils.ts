/**
 * Function that returns the test name and the snapshot html
 * @param content content from the vs code editor
 * example: "exports[`test1`] = `html1`    exports[`test2`] = `html2`"
 * returns: [ { key:test1,value:html1 },{ key:test2,value:html2 } ]
 */
export const parseContent = (content: string) => {
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

/**
 * Created html markup for snapshot
 * @param pairs array of objects with key and value
 */
export const renderPairs = (pairs: any[]) => {
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

/**
 * Function that returns the html doc
 * @param content content from the vs code editor
 * @returns html markup
 */
export const generateMarkup = (content: string) => {
    const getTestPairs = parseContent(content);
    const getTestPairsHtml = renderPairs(getTestPairs);
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