import { ListRolesCommand, Role } from "@aws-sdk/client-iam";
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

    let awsBucketTreeNode = roles?.map((_role) => {
      const name = _role?.RoleName || "untitled";
      const tooltip = name;
      
      const role = {
        roleId: _role.RoleId || "",
        roleName: _role.RoleName || "",
        arn: _role.Arn || "",
        path: _role.Path || "",

        maxSessionDuration: _role.MaxSessionDuration,
        description: _role.Description,
        createDate: _role.CreateDate,
      };

      return new AWSIamRoleTreeNode(role, tooltip);
    });

    return awsBucketTreeNode || [];
  }
}
