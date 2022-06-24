// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import pss from './powershellprocessor';

var path = require("path");

const configuration = vscode.workspace.getConfiguration();

const solutionUniqueName = configuration.get('Build.SolutionName');
const schemaNameFile = configuration.get('Build.ShemaNameFileJs');
const productionJSPath = configuration.get('Build.ProductionJSPath');
const outputSaveZipArchive = configuration.get('Build.outputSaveZipArchive');
const coreToolCRMsolutionpackager = configuration.get('Build.coreToolCRMsolutionpackager');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const currentEstensionPath = context.extensionPath;
	const currentTemplatePath = currentEstensionPath + '\\out\\PreparedTemplates\\CRMSolution'
	let runBuildSolution = `${currentEstensionPath}\\out\\PSscripts\\GenerateCRMSolution.ps1 -SolutionUniqueName "${solutionUniqueName}" -SchemaNameFile "${schemaNameFile}" -PathToSolutionPack "${outputSaveZipArchive}" -ProductionJSPath "${productionJSPath}" -PartPathToTemplate "${currentTemplatePath}"`;

	let runPackSolution = `${coreToolCRMsolutionpackager} /action:Pack  /zipfile:"${outputSaveZipArchive}\\${solutionUniqueName}.zip"  /folder:"${outputSaveZipArchive}"`;

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('builder365solution.build', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		var t1 = pss.process([runBuildSolution]);
		console.log(t1);
		vscode.window.showInformationMessage('Start build solution from Dynamics CRM 365!');
		setTimeout(() => {
			var t2 = pss.process([runPackSolution]);
			console.log(t2);
			vscode.window.showInformationMessage('Finish build solution from Dynamics CRM 365!');
		}, 5000);

	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
