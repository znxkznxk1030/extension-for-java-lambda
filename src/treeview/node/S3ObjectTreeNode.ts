import { TreeItemCollapsibleState } from "vscode";
import { AWSTreeNodeBase } from "./TreeNodeBase";

export class AWSS3ObjectTreeNode extends AWSTreeNodeBase {

  public constructor(
    public readonly parent: AWSTreeNodeBase | undefined,
    label: string,
    tooltip?: string
  ) {
    super(label, TreeItemCollapsibleState.None);
    this.tooltip = tooltip;
    this.contextValue = "awsObjectNode";
  }
}