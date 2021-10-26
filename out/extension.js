"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const render_1 = require("./render-content/render");
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('snapshotRender.start', () => {
        let editor = vscode.window.activeTextEditor;
        let content = editor?.document.getText();
        if (!content) {
            vscode.window.showInformationMessage('No content to render!');
            return;
        }
        render_1.SnapshotRenderPanel.createOrShow(context.extensionUri, content);
    }));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map