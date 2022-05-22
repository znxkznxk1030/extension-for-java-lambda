/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from "vscode";

import { DeleteFunctionCommand } from "@aws-sdk/client-lambda";
import { lambdaClient } from "../../clients/lambdaClient";

export async function deleteLambdaFunction(functionName: string) {
  const result = await lambdaClient.send(
    new DeleteFunctionCommand({ FunctionName: functionName })
  );

  // TODO: wizard로 한번더 확인해서 지우도록 확인

  console.log(result);

  vscode.window.showInformationMessage(
    `[ Success ] Lambda Function ${functionName} is deleted.`
  );

  vscode.commands.executeCommand("lambda.refreshEntry");
}
