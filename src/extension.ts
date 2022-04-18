// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { activateIAM } from "./iam/activation";
import { IAMRoleExplorer } from "./iam/explorer/IAMRoleExplorer";
import { activateLambda } from "./lambda/activation";
import { LambdaExplorer } from "./lambda/explorer/LambdaExplorer";
import { activateS3 } from "./s3/activation";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "toolkit-for-awsLambdaExplorer-java" is now active!'
  );

  activateLambda(context);
  activateIAM(context);
  activateS3(context);
}

// this method is called when your extension is deactivated
export function deactivate() {}
