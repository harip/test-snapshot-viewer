"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapshotRenderPanel = void 0;
const vscode = require("vscode");
const utils_1 = require("../utils/utils");
/**
 * Manages cat coding webview panels
 */
class SnapshotRenderPanel {
    constructor(panel, editorContent) {
        this._disposables = [];
        this._panel = panel;
        // Set the webview's initial html content
        this.setPanelHtmlContent(editorContent);
        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programmatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        // Update the content based on view changes
        this._panel.onDidChangeViewState(e => {
            const content = SnapshotRenderPanel.changedContent ? SnapshotRenderPanel.changedContent : editorContent;
            if (this._panel.visible) {
                this.setPanelHtmlContent(content);
            }
        }, null, this._disposables);
    }
    static createOrShow(extensionUri, editorContent) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        // If we already have a panel, show it.
        if (SnapshotRenderPanel.currentPanel) {
            SnapshotRenderPanel.changedContent = editorContent;
            SnapshotRenderPanel.currentPanel._panel.reveal(column);
            return;
        }
        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(SnapshotRenderPanel.viewType, 'Cat Coding', column || vscode.ViewColumn.One, {
            // Enable javascript in the webview
            enableScripts: true,
            // And restrict the webview to only loading content from our extension's `media` directory.
            localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
        });
        SnapshotRenderPanel.currentPanel = new SnapshotRenderPanel(panel, editorContent);
    }
    setPanelHtmlContent(editorContent) {
        this._panel.title = 'Snahshot Viewer';
        this._panel.webview.html = (0, utils_1.generateMarkup)(editorContent);
    }
    dispose() {
        SnapshotRenderPanel.currentPanel = undefined;
        // Clean up our resources
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
}
exports.SnapshotRenderPanel = SnapshotRenderPanel;
SnapshotRenderPanel.viewType = 'snapshotRender';
SnapshotRenderPanel.changedContent = '';
//# sourceMappingURL=render.js.map