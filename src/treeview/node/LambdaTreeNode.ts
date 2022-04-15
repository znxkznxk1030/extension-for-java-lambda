export interface AWSLambdaNode {
  arn: string;
  name: string;
  role: string;
  runtime: string;
  packageType: string;
  handler: string;
  //
  description: string;
  memorySize: number | undefined;
  codeSize: number | undefined;

  // revisionId: string;
  // lastModified: string;
}

import { TreeItemCollapsibleState } from "vscode";
import { AWSTreeNodeBase } from "./TreeNodeBase";

export class AWSLambdaTreeNode extends AWSTreeNodeBase {
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