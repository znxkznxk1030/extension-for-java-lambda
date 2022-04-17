import { ListFunctionsCommand } from "@aws-sdk/client-lambda";
import * as vscode from "vscode";
import { lambdaClient } from "../../clients/lambdaClient";
import { AWSTreeDataProvider } from "../../treeview/awsTreeDataProvider";
import { AWSLambdaTreeNode } from "./LambdaTreeNode";
import { AWSTreeNodeBase } from "../../treeview/node/TreeNodeBase";

export class LambdaExplorer extends AWSTreeDataProvider {
  constructor() {
    super();
  }

  async listChildren(): Promise<AWSTreeNodeBase[]> {
    let { Functions: functions } = await lambdaClient.send(
      new ListFunctionsCommand({})
    );

    let awsBucketTreeNode = functions?.map((role) => {
      const name = role?.FunctionName || "untitled";
      const tooltip = name;
      return new AWSLambdaTreeNode(undefined, name, tooltip);
    });

    return awsBucketTreeNode || [];
  }
}
