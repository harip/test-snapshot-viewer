import * as vscode from 'vscode';
import { generateMarkup, parseContent, renderPairs } from '../utils/utils';

/**
 * Manages cat coding webview panels
 */
export class SnapshotRenderPanel {
	/**
	 * Track the currently panel. Only allow a single panel to exist at a time.
	 */
	public static currentPanel: SnapshotRenderPanel | undefined;
	public static readonly viewType = 'snapshotRender';
	private readonly _panel: vscode.WebviewPanel;
	private static changedContent = '';
	private _disposables: vscode.Disposable[] = [];

	public static createOrShow(extensionUri: vscode.Uri, editorContent?: any) {
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
		const panel = vscode.window.createWebviewPanel(
			SnapshotRenderPanel.viewType,
			'Cat Coding',
			column || vscode.ViewColumn.One,
			{
				// Enable javascript in the webview
				enableScripts: true,

				// And restrict the webview to only loading content from our extension's `media` directory.
				localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
			},
		);

		SnapshotRenderPanel.currentPanel = new SnapshotRenderPanel(panel, editorContent);
	}

	private constructor(panel: vscode.WebviewPanel, editorContent?: any) {
		this._panel = panel;

		// Set the webview's initial html content
		this.setPanelHtmlContent(editorContent);

		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programmatically
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

		// Update the content based on view changes
		this._panel.onDidChangeViewState(
			e => {
				const content = SnapshotRenderPanel.changedContent ? SnapshotRenderPanel.changedContent : editorContent;
				if (this._panel.visible) {
					this.setPanelHtmlContent(content);
				}
			},
			null,
			this._disposables
		);
	}

	private setPanelHtmlContent(editorContent?: any) {
		this._panel.title = 'Snahshot Viewer';
		this._panel.webview.html = generateMarkup(editorContent);
	}

	public dispose() {
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