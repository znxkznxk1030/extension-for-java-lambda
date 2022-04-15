// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ListRolesCommand } from "@aws-sdk/client-iam";
import { ListFunctionsCommand } from "@aws-sdk/client-lambda";
import { ListBucketsCommand } from "@aws-sdk/client-s3";
import * as vscode from "vscode";
import { iamClient } from "./clients/iamClient";
import { lambdaClient } from "./clients/lambdaClient";
import { s3Client } from "./clients/s3Client";
import { IAMRoleTreeProvider } from "./treeview/iamRoleTreeProvider";
import { LambdaTreeProvider } from "./treeview/lambdaTreeProvider";
import { S3BucketTreeProvider } from "./treeview/s3BucketTreeProvider";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "toolkit-for-aws-lambda-java" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "toolkit-for-aws-lambda-java.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage(
        "Hello World from Toolkit for AWS Lambda ( Java )!"
      );
    }
  );

  context.subscriptions.push(disposable);

  const rootPath =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;

  // vscode.window.registerTreeDataProvider(
  //   "nodeDependencies",
  //   // null
  // );
  console.log(vscode.workspace);
  console.log(rootPath);

  s3Client.send(new ListBucketsCommand({})).then((res) => {
    console.log(res);
  });

  iamClient.send(new ListRolesCommand({})).then(console.log);

  lambdaClient.send(new ListFunctionsCommand({})).then(console.log);

  vscode.window.registerTreeDataProvider(
    "aws-s3-buckets",
    new S3BucketTreeProvider()
  );

  vscode.window.registerTreeDataProvider(
    "aws-iam-role",
    new IAMRoleTreeProvider()
  );

  vscode.window.registerTreeDataProvider(
    "aws-lambda",
    new LambdaTreeProvider()
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
