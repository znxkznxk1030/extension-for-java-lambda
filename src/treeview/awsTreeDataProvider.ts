import * as vscode from "vscode";
import { AWSTreeNodeBase } from "./node/TreeNodeBase";

export abstract class AWSTreeDataProvider
  implements vscode.TreeDataProvider<AWSTreeNodeBase>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    AWSTreeNodeBase | undefined | null | void
  > = new vscode.EventEmitter<AWSTreeNodeBase | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    AWSTreeNodeBase | undefined | null | void
  > = this._onDidChangeTreeData.event;

  getTreeItem(
    element: AWSTreeNodeBase
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  async getChildren(element?: AWSTreeNodeBase): Promise<AWSTreeNodeBase[]> {
    let childNodes: AWSTreeNodeBase[] = [];

    if (element) {
      childNodes = childNodes.concat(await element.getChildren());
    } else {
      childNodes = childNodes.concat(await this.listChildren());
    }

    return childNodes;
  }

  abstract listChildren(): Promise<AWSTreeNodeBase[]>;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}
