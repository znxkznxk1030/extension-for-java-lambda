import { ListFunctionsCommand } from "@aws-sdk/client-lambda";
import * as vscode from "vscode";
import { lambdaClient } from "../clients/lambdaClient";
import { AWSLambdaTreeNode } from "./node/LambdaTreeNode";
import { AWSTreeNodeBase } from "./node/TreeNodeBase";

export class LambdaTreeProvider
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
      childNodes = childNodes.concat(await this.listAWSLambda());
    }

    return childNodes;
  }

  private async listAWSLambda(): Promise<AWSTreeNodeBase[]> {
    let { Functions: functions } = await lambdaClient.send(
      new ListFunctionsCommand({})
    );

    let awsBucketTreeNode = functions?.map((role) => {
      const name = role?.FunctionName || "untitled";
      const tooltip = name;
      return new AWSLambdaTreeNode(undefined, name, tooltip);
    });

    return awsBucketTreeNode || [];
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}
