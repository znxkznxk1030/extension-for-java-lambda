import { ListRolesCommand } from "@aws-sdk/client-iam";
import * as vscode from "vscode";
import { iamClient } from "../clients/iamClient";
import { AWSIamRoleTreeNode } from "./node/IAMRoleTreeNode";
import { AWSTreeNodeBase } from "./node/TreeNodeBase";

export class IAMRoleTreeProvider
  implements vscode.TreeDataProvider<AWSTreeNodeBase>
{
  onDidChangeTreeData?:
    | vscode.Event<
        void | AWSTreeNodeBase | AWSTreeNodeBase[] | null | undefined
      >
    | undefined;

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
      childNodes = childNodes.concat(await this.listAWSIamRole());
    }

    return childNodes;
  }

  private async listAWSIamRole(): Promise<AWSTreeNodeBase[]> {
    let { Roles: roles } = await iamClient.send(new ListRolesCommand({}));

    let awsBucketTreeNode = roles?.map((role) => {
      const name = role?.RoleName || "untitled";
      const tooltip = name;
      return new AWSIamRoleTreeNode(undefined, name, tooltip);
    });

    return awsBucketTreeNode || [];
  }
}
