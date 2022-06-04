import { PutObjectCommandInput } from "@aws-sdk/client-s3";
import { getServers } from "dns";
import * as fs from "fs";
import { Uri } from "vscode";
import { Wizard } from "../../wizard/wizard";

export type TUploadObjectWizardContext = {
  bucketName: string | undefined;
  key: string | undefined;
  file: Uri | undefined;
};

export type TUploadObjectRequest = {
  Bucket: string;
  key: string;
  content: string;
};

export type TUploadObjectPayload = {
  filePath: string;
};

export class UploadObejctWizard extends Wizard<
  TUploadObjectWizardContext,
  PutObjectCommandInput
> {
  constructor(initialContext: Partial<TUploadObjectWizardContext>) {
    super();
    this.context = {
      ...initialContext,
    };
  }

  protected getResult(): PutObjectCommandInput {
    try {
      const uri = this.context.file;
      const path = uri?.fsPath as fs.PathLike;

      const stream = fs.createReadStream(path);
      const uploadObjectRequest = {
        Bucket: this.context.bucketName,
        Key: this.context.key,
        Body: stream.readable,
      } as PutObjectCommandInput;

      console.log("putObejctRequest: ", uploadObjectRequest);
      return uploadObjectRequest;
    } catch (e) {
      console.error(e);
      throw new Error(
        "Fail To Upload Object. If Thie Error Repeated, Upload Object Directly With AWS Console. ( https://console.aws.amazon.com/console/home ) "
      );
    }
  }
}
