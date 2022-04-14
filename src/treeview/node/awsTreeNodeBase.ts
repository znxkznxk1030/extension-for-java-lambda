import { TreeItem, TreeItemCollapsibleState, commands } from "vscode";

export abstract class AWSTreeNodeBase extends TreeItem {
  protected constructor(
    label: string,
    collapsibleState?: TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
  }

  public getChildren(): Thenable<AWSTreeNodeBase[]> {
    return Promise.resolve([]);
  }
}
