import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { AWSTreeNodeBase } from "./node/awsTreeNodeBase";
import { s3Client } from "../clients/s3Client";
import { ListBucketsCommand } from "@aws-sdk/client-s3";
import { AWSS3BucketTreeNode } from "./node/awsS3BucketTreeNode";

export class S3BucketTreeProvider
  implements vscode.TreeDataProvider<AWSTreeNodeBase>
{
  onDidChangeTreeData?:
    | vscode.Event<
        void | AWSTreeNodeBase | AWSTreeNodeBase[] | null | undefined
      >
    | undefined;

  public getTreeItem(element: AWSTreeNodeBase): vscode.TreeItem {
    return element;
  }

  public async getChildren(
    element?: AWSTreeNodeBase
  ): Promise<AWSTreeNodeBase[]> {
    let childNodes: AWSTreeNodeBase[] = [];

    if (element) {
      childNodes = childNodes.concat(await element.getChildren());
    } else {
      childNodes = childNodes.concat(await this.listAWSS3Bucket());
    }

    return childNodes;
  }

  private async listAWSS3Bucket(): Promise<AWSTreeNodeBase[]> {
    let { Buckets: bucketList } = await s3Client.send(
      new ListBucketsCommand({})
    );

    let awsBucketTreeNode = bucketList?.map((bucket) => {
      const name = bucket?.Name || "untitled";
      const tooltip = name;
      return new AWSS3BucketTreeNode(undefined, name, tooltip);
    });

    return awsBucketTreeNode || [];
  }
}
