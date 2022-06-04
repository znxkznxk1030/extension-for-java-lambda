import * as vscode from "vscode";
import * as fs from "fs";
import {
  TUploadObjectWizardContext,
  UploadObejctWizard,
} from "../wizard/UploadObjectWizard";
import {
  DefaultPickItem,
  InputPrompter,
  PickPrompter,
} from "../../ui/prompter";
import { s3Client } from "../../clients/s3Client";
import { Bucket, ListBucketsCommand } from "@aws-sdk/client-s3";
import { AWSS3BucketTreeNode } from "../explorer/S3BucketTreeNode";
import path = require("path");

export async function uploadObject(treeNode: AWSS3BucketTreeNode) {
  console.log(treeNode);

  const keyPrompter = new InputPrompter({
    id: "Key",
    title: "(1/2) Enter the key of S3 Object",
    verifyPickItem: (
      key: any,
      resolve: (value: PromiseLike<undefined> | undefined) => void,
      reject: (reason?: any) => void
    ) => {
      if (!!!key || /^\s*$/.test(key)) {
        // TODO: 람다 이름 정규식 추가
        reject("Doesn't match s3 object name format");
      }
    },
  });

  const filePrompter = new PickPrompter({
    id: "s3object",
    title: "(2/2) Select a file to upload",
    loadItemsAsync: async (context: TUploadObjectWizardContext) => {
      const files: vscode.Uri[] = await vscode.workspace.findFiles("**/*.jar");

      return files;
    },
    mapperToPickItem: (files) => {
      return files?.map((file) => {
        const fileNameToDisplay = path.basename(file.path);
        return new DefaultPickItem(fileNameToDisplay, file);
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



  const wizard = new UploadObejctWizard({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Bucket: treeNode.label as string,
  });

  wizard.addPrompter(keyPrompter);
  wizard.addPrompter(filePrompter);

  let payload = await wizard.run();

  if (!payload) {
    return;
  }

  console.info(payload);
}
