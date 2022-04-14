
import { TreeItemCollapsibleState } from "vscode";
import { AWSTreeNodeBase } from "./awsTreeNodeBase";

export class AWSS3BucketTreeNode extends AWSTreeNodeBase {
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