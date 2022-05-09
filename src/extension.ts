// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import pss from './powershellprocessor';

var path = require("path");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "builder365solution" is now active!');

	const configuration = vscode.workspace.getConfiguration();
	// 3) Get the current value
	const solutionUniqueName = configuration.get('Build.SolutionName');
	const schemaNameFile = configuration.get('Build.ShemaNameFileJs');
	const productionJSPath = configuration.get('Build.ProductionJSPath');

	let runBuildSolution = 'C:\\CRMDeveloperTools\\VsCodeExtension\\CreateSolutionWIthResources.ps1 '
		+ '-SolutionUniqueName "' + solutionUniqueName + '"'
		+ '-SchemaNameFile "' + schemaNameFile + '"'
		+ '-PathToSolutionPack "C:\\CRMDeveloperTools\\TmpSolution\\NewSolution"'
		+ '-ProductionJSPath "' + productionJSPath + '"';
	let runPackSolution = 'C:\\CRMDeveloperTools\\Tools\\CoreTools\\solutionpackager.exe '
		+ '/action:Pack '
		+ '/zipfile:"C:\\CRMDeveloperTools\\TmpSolution\\NewSolution.zip" '
		+ '/folder:"C:\\CRMDeveloperTools\\TmpSolution\\NewSolution"';

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('builder365solution.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		var t1 = pss.process([runBuildSolution]);
		var t2 = pss.process([runPackSolution]);
		console.log(t1[0].output);
		console.log(t2[0].output);
		// setTimeout(function () {
		// 	// console.log(t1.toString());
		// 	// console.log(t2.toString());
		// }, 5000);
		vscode.window.showInformationMessage('Hello World from builder365solution!');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
