import * as vscode from "vscode";
import { S3BucketExplorer } from "../s3/explorer/S3BucketExplorer";
import { uploadObject } from "./commands/uploadObject";

export async function activateS3(context: vscode.ExtensionContext) {
  const s3BucketTreeProvider = new S3BucketExplorer();
  let s3Tree = vscode.window.registerTreeDataProvider(
    "awsS3BucketExplorer",
    s3BucketTreeProvider
  );

  context.subscriptions.push(s3Tree);

  context.subscriptions.push(
    vscode.commands.registerCommand("s3buckets.refreshEntry", () => {
      s3BucketTreeProvider.refresh();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("s3buckets.createObject", uploadObject)
  );
}
