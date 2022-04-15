import path = require("path");
import { TreeItemCollapsibleState } from "vscode";
import { AWSTreeNodeBase } from "./TreeNodeBase";

export class AWSIAMPolicyTreeNode extends AWSTreeNodeBase {
  
  public constructor(
    public readonly parent: AWSTreeNodeBase | undefined,
    label: string,
    tooltip?: string
  ) {
    super(label, TreeItemCollapsibleState.None);
    this.tooltip = tooltip;
    this.contextValue = "awsIAMPolicyNode";
  }

  iconPath = path.join(__dirname, "..", "media", "aws-policy-2.png");
}
