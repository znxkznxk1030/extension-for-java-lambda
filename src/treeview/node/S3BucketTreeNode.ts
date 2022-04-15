import { ListObjectsCommand } from "@aws-sdk/client-s3";
import path = require("path");
import { TreeItemCollapsibleState } from "vscode";
import { s3Client } from "../../clients/s3Client";
import { AWSS3ObjectTreeNode } from "./S3ObjectTreeNode";
import { AWSTreeNodeBase } from "./TreeNodeBase";

export class AWSS3BucketTreeNode extends AWSTreeNodeBase {
  private readonly bucket: string;

  public constructor(
    public readonly parent: AWSTreeNodeBase | undefined,
    label: string,
    tooltip?: string
  ) {
    super(label, TreeItemCollapsibleState.Collapsed);
    this.bucket = label;
    this.tooltip = tooltip;
    this.contextValue = "awsBucketNode";
  }

  public async getChildren(): Promise<AWSTreeNodeBase[]> {
    return await this.listAWSS3Object();
  }

  public async updateChildren(): Promise<void> {}

  private async listAWSS3Object(): Promise<AWSTreeNodeBase[]> {
    let { Contents: s3Objects } = await s3Client.send(
      // eslint-disable-next-line @typescript-eslint/naming-convention
      new ListObjectsCommand({ Bucket: this.bucket })
    );

    console.log(s3Objects);

    return (
      s3Objects
        ?.map((s3Obj): AWSS3ObjectTreeNode => {
          const name = s3Obj?.Key || "untitled";
          const tooltip = name;
          return new AWSS3ObjectTreeNode(this, name, tooltip);
        })
        .filter((obj) => obj.isArchive()) || []
    );
  }

  iconPath = path.join(__dirname, "..", "media", "aws-bucket.svg");
}
