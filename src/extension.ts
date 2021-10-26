import * as vscode from 'vscode';
import { SnapshotRenderPanel } from './render-content/render';
 
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('snapshotRender.start', () => {

			let editor=vscode.window.activeTextEditor;
			let content = editor?.document.getText(); 
			if (!content){
				vscode.window.showInformationMessage('No content to render!');
				return;
			} 

			SnapshotRenderPanel.createOrShow(context.extensionUri,content);
		})
	); 
}