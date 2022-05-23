/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from "vscode";

import { DeleteFunctionCommand } from "@aws-sdk/client-lambda";
import { lambdaClient } from "../../clients/lambdaClient";
import { InputPrompter } from "../../ui/prompter";

export async function deleteLambdaFunction(functionName: string) {
  const confirmPrompter = new InputPrompter({
    id: "confirm",
    title: `To confirm deletion, type "delete" in the field.
      ( Deleting a function permanently removes the function code. Relevant logs, roles, test event schemas, and triggers are kept in your account. )`,
    placeHolder: `delete`,
    verifyPickItem: (
      item: any,
      resolve: (value: PromiseLike<undefined> | undefined) => void,
      reject: (reason?: any) => void
    ) => {
      if (!!!item || /^\s*$/.test(item)) {
        // TODO: 람다 이름 정규식 추가
        reject("Doesn't match lambda name format");
        // throw new Error("Doesn't match lambda name format");
      }
    },
  });

  const confirm = await confirmPrompter.interact();

  if (confirm?.data === "delete") {
    const result = await lambdaClient.send(
      new DeleteFunctionCommand({ FunctionName: functionName })
    );

    console.log(result);

    vscode.window.showInformationMessage(
      `[ SUCCESS ] Lambda Function ${functionName} is deleted.\n`
    );

    vscode.commands.executeCommand("lambda.refreshEntry");
  }
}
