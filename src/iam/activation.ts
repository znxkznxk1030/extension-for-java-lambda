import * as vscode from "vscode";
import { IAMRoleExplorer } from "./explorer/IAMRoleExplorer";

export async function activateIAM(context: vscode.ExtensionContext) {
    const iamRoleTreeProvider = new IAMRoleExplorer();

  let iamTree = vscode.window.registerTreeDataProvider(
    "awsIAMRoleExplorer",
    iamRoleTreeProvider
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("iamRole.refreshEntry", () => {
      iamRoleTreeProvider.refresh();
    })
  );

    context.subscriptions.push(iamTree);

}
