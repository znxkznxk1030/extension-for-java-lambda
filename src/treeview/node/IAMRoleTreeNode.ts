export interface AWSIAMRoleNode {
  arn: string;
  name: string;
  description: string;
  roleId: string;
  createDate: string;
}

import { TreeItemCollapsibleState } from "vscode";
import { AWSTreeNodeBase } from "./TreeNodeBase";

export class AWSIamRoleTreeNode extends AWSTreeNodeBase {
  public constructor(
    public readonly parent: AWSTreeNodeBase | undefined,
    label: string,
    tooltip?: string
  ) {
    super(label, TreeItemCollapsibleState.None);
    this.tooltip = tooltip;
    this.contextValue = "awsBucketNode";
  }
}