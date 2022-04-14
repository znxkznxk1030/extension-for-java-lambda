import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export class S3BucketTreeProvider implements vscode.TreeDataProvider<Object> {
  onDidChangeTreeData?: vscode.Event<void | Object | Object[] | null | undefined> | undefined;
  getTreeItem(element: Object): vscode.TreeItem | Thenable<vscode.TreeItem> {
    throw new Error("Method not implemented.");
  }
  getChildren(element?: Object): vscode.ProviderResult<Object[]> {
    throw new Error("Method not implemented.");
  }
}
