import * as vscode from "vscode";
import { LambdaExplorer } from "./explorer/LambdaExplorer";

export async function activateLambda(context: vscode.ExtensionContext) {
  const lambdaTreeProvider = new LambdaExplorer();

  let lambdaTree = vscode.window.registerTreeDataProvider(
    "awsLambdaExplorer",
    lambdaTreeProvider
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("lambda.refreshEntry", () => {
      lambdaTreeProvider.refresh();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("lambda.createFunction", () => {
      // lambdaTreeProvider.refresh();
      const picker = vscode.window.createQuickPick < vscode.QuickPickItem >();
      picker.show();
    })
  );

  context.subscriptions.push(lambdaTree);
}
