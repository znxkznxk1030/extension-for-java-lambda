/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from "vscode";

import { DeleteFunctionCommand } from "@aws-sdk/client-lambda";
import { lambdaClient } from "../../clients/lambdaClient";

export async function deleteLambdaFunction(functionName: string) {
  const result = await lambdaClient.send(
    new DeleteFunctionCommand({ FunctionName: functionName })
  );

  console.log(result);

  vscode.window.showInformationMessage(
    `[ Success ] Lambda Function ${functionName} is deleted.`
  );

  vscode.commands.executeCommand("lambda.refreshEntry");
}
