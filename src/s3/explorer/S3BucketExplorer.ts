import { AWSTreeNodeBase } from "../../treeview/node/TreeNodeBase";
import { s3Client } from "../../clients/s3Client";
import { ListBucketsCommand } from "@aws-sdk/client-s3";
import { AWSS3BucketTreeNode } from "./S3BucketTreeNode";
import { AWSTreeDataProvider } from "../../treeview/AwsTreeDataProvider";

export class S3BucketExplorer extends AWSTreeDataProvider {
  constructor() {
    super();
  }

  async listChildren(): Promise<AWSTreeNodeBase[]> {
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
