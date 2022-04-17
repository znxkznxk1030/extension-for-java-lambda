// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ListRolesCommand } from "@aws-sdk/client-iam";
import { ListFunctionsCommand } from "@aws-sdk/client-lambda";
import { ListBucketsCommand } from "@aws-sdk/client-s3";
import * as vscode from "vscode";
import { iamClient } from "./clients/iamClient";
import { lambdaClient } from "./clients/lambdaClient";
import { s3Client } from "./clients/s3Client";
import { IAMRoleExplorer } from "./iam/explorer/IAMRoleExplorer";
import { LambdaExplorer } from "./lambda/explorer/LambdaExplorer";
import { S3BucketExplorer } from "./s3/explorer/S3BucketExplorer";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "toolkit-for-awsLambdaExplorer-java" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  // let disposable = vscode.commands.registerCommand(
  //   "toolkit-for-awsLambdaExplorer-java.helloWorld",
  //   () => {
  //     // The code you place here will be executed every time your command is executed
  //     // Display a message box to the user
  //     vscode.window.showInformationMessage(
  //       "Hello World from Toolkit for AWS Lambda ( Java )!"
  //     );
  //   }
  // );

  // context.subscriptions.push(disposable);

  // const rootPath =
  //   vscode.workspace.workspaceFolders &&
  //   vscode.workspace.workspaceFolders.length > 0
  //     ? vscode.workspace.workspaceFolders[0].uri.fsPath
  //     : undefined;

  // console.log(vscode.workspace);
  // console.log(rootPath);

  const s3BucketTreeProvider = new S3BucketExplorer();
  const iamRoleTreeProvider = new IAMRoleExplorer();
  const lambdaTreeProvider = new LambdaExplorer();

  let iamTree = vscode.window.registerTreeDataProvider(
    "awsIAMRoleExplorer",
    iamRoleTreeProvider
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("iamRole.refreshEntry", () => {
      iamRoleTreeProvider.refresh();
    })
  );

  let s3Tree = vscode.window.registerTreeDataProvider(
    "awsS3BucketExplorer",
    s3BucketTreeProvider
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("s3buckets.refreshEntry", () => {
      s3BucketTreeProvider.refresh();
    })
  );

  let lambdaTree = vscode.window.registerTreeDataProvider(
    "awsLambdaExplorer",
    lambdaTreeProvider
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("lambda.refreshEntry", () => {
      lambdaTreeProvider.refresh();
    })
  );

  context.subscriptions.push(iamTree);
  context.subscriptions.push(s3Tree);
  context.subscriptions.push(lambdaTree);
}

// this method is called when your extension is deactivated
export function deactivate() {}
