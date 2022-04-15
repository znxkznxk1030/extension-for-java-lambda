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

export async function makeChildNodes<
  T extends AWSTreeNodeBase,
  P extends AWSTreeNodeBase,
  E extends AWSTreeNodeBase
>(parameters: {
  getChildNodes(): Promise<T[]>;
  getNoChildrenPlaceholderNode?(): Promise<P>;
  getErrorNode(error: Error, logID?: number): Promise<E>;
  sort?: (a: T, b: T) => number;
}): Promise<T[] | [P] | [E]> {
  try {
    const nodes = await parameters.getChildNodes();

    if (nodes.length === 0 && parameters.getNoChildrenPlaceholderNode) {
      return [await parameters.getNoChildrenPlaceholderNode()];
    }

    if (parameters.sort) {
      nodes.sort((a, b) => parameters.sort!(a, b));
    }

    return nodes;
  } catch (err) {
    const error = err as Error;

    return [await parameters.getErrorNode(error)];
  }
}
