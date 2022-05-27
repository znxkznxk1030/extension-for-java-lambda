import * as vscode from "vscode";
import * as fs from "fs";
import {
  TUploadObjectWizardContext,
  UploadObejctWizard,
} from "../wizard/UploadObjectWizard";
import { DefaultPickItem, PickPrompter } from "../../ui/prompter";

export async function uploadObject() {
  const filePrompter = new PickPrompter({
    id: "s3object",
    title: "(1/2) Select a file to upload",
    loadItemsAsync: async (context: TUploadObjectWizardContext) => {
      const files:vscode.Uri[] = await vscode.workspace.findFiles("**/*.jar");

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
      const file:vscode.Uri = item.data as vscode.Uri;

      if (!!!file || /^\s*$/.test(file.path)) {
        reject("[Error] A file is mandatory.");
      }
    },
  });

  const wizard = new UploadObejctWizard({});

  wizard.addPrompter(filePrompter);

  let payload = await wizard.run();

  if (!payload) {
    return;
  }

  console.info(payload);
}
