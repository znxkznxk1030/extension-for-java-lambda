import path = require("path");
import { TreeItemCollapsibleState } from "vscode";
import { AWSTreeNodeBase } from "./TreeNodeBase";

export class AWSS3ObjectTreeNode extends AWSTreeNodeBase {
  private readonly ext: string;
  public constructor(
    public readonly parent: AWSTreeNodeBase | undefined,
    label: string,
    tooltip?: string
  ) {
    super(label, TreeItemCollapsibleState.None);
    this.ext = label.split(".").pop() || "";
    this.tooltip = tooltip;
    this.contextValue = "awsObjectNode";
    this.iconPath = this.gatFileIconPath();
  }

  public isArchive(): boolean {
    return ["jar", "war", "zip"].includes(this.ext);
  }

  private gatFileIconPath(): string {
    switch (this.ext) {
      case "jar":
      case "war":
        return path.join(__dirname, "..", "media", "java-icon.png");
      case "zip":
        return path.join(__dirname, "..", "media", "zip-icon.png");
    }

    return "";
  }
}
