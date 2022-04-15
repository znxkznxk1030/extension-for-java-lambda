import path = require("path");
import { TreeItemCollapsibleState } from "vscode";
import { AWSTreeNodeBase } from "./TreeNodeBase";

export class AWSS3ObjectTreeNode extends AWSTreeNodeBase {
  private readonly s3Key: string;
  public constructor(
    public readonly parent: AWSTreeNodeBase | undefined,
    label: string,
    tooltip?: string
  ) {
    super(label, TreeItemCollapsibleState.None);
    this.s3Key = label;
    this.tooltip = tooltip;
    this.contextValue = "awsObjectNode";
    this.iconPath = this.gatFileIconPath();
  }

  private gatFileIconPath(): string {
    const ext = this.s3Key.split(".").pop();

    switch (ext) {
      case "jar":
        return path.join(__dirname, "..", "media", "jar-icon.png");
    }

    return "";
  }
}
