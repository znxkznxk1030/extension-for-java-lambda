import * as vscode from "vscode";
import * as fs from "fs";
import {
  TUploadObjectWizardContext,
  UploadObejctWizard,
} from "../wizard/UploadObjectWizard";
import { DefaultPickItem, PickPrompter } from "../../ui/prompter";
import { s3Client } from "../../clients/s3Client";
import { Bucket, ListBucketsCommand } from "@aws-sdk/client-s3";

export async function uploadObject() {
  const filePrompter = new PickPrompter({
    id: "s3object",
    title: "(2/3) Select a file to upload",
    loadItemsAsync: async (context: TUploadObjectWizardContext) => {
      const files: vscode.Uri[] = await vscode.workspace.findFiles("**/*.jar");

      return files;
    },
    mapperToPickItem: (files) => {
      return files?.map((file) => {
        return new DefaultPickItem(file.path, file);
      });
    },
    verifyPickItem: (
      item: DefaultPickItem,
      _resolve: (value: PromiseLike<undefined> | undefined) => void,
      reject: (reason?: any) => void
    ) => {
      const file: vscode.Uri = item.data as vscode.Uri;

      if (!!!file || /^\s*$/.test(file.path)) {
        reject("[Error] A file is mandatory.");
      }
    },
  });

  const bucketPrompter = new PickPrompter({
    id: "bucket",
    title: "(3/3) Select S3 Bucket",
    loadItemsAsync: async (context: TUploadObjectWizardContext) => {
      let { Buckets: buckets } = await s3Client.send(
        new ListBucketsCommand({})
      );

      return buckets;
    },
    mapperToPickItem: (bucketList?: Bucket[]) => {
      return bucketList?.map((bucket) => {
        return new DefaultPickItem(bucket.Name, bucket);
      });
    },
    verifyPickItem: (
      item: any,
      _resolve: (value: PromiseLike<undefined> | undefined) => void,
      reject: (reason?: any) => void
    ) => {
      if (!!!item || /^\s*$/.test(item)) {
        reject("[Error] A S3 Bucket is mandatory.");
      }
    },
  });

  const wizard = new UploadObejctWizard({});

  wizard.addPrompter(filePrompter);
  wizard.addPrompter(bucketPrompter);

  let payload = await wizard.run();

  if (!payload) {
    return;
  }

  console.info(payload);
}
