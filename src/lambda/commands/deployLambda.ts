/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from "vscode";
import {
  IAMServiceException,
  ListRolesCommand,
  Role,
} from "@aws-sdk/client-iam";
import { iamClient } from "../../clients/iamClient";
import {
  DefaultPickItem,
  InputPrompter,
  PickPrompter,
} from "../../ui/prompter";
import { s3Client } from "../../clients/s3Client";
import {
  Bucket,
  ListBucketsCommand,
  ListObjectsCommand,
  _Object,
} from "@aws-sdk/client-s3";
import { ENTITY_LAMBDA, hasRoleTrustedEntity } from "../../iam/utils";
import {
  DeployLambdaWizard,
  TWizardContext,
} from "../wizard/DeployLambdaWizard";
import { lambdaClient } from "../../clients/lambdaClient";
import {
  CreateFunctionCommand,
  InvalidParameterValueException,
  ResourceConflictException,
  Runtime,
  ServiceException,
  UpdateFunctionCodeCommand,
  UpdateFunctionCodeCommandInput,
} from "@aws-sdk/client-lambda";
import { LambdaExplorer } from "../explorer/LambdaExplorer";

export async function deployLambdaFunction() {
  const namePrompter = new InputPrompter({
    id: "name",
    title: "Enter the lambda function name",
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

  const descriptionrompter = new InputPrompter({
    id: "Description",
    title: "Describe the lambda function ( optional )",
  });

  const runtimePrompter = new PickPrompter({
    id: "runtime",
    title: "Select Runtime Environment",
    loadItemsAsync: (context: TWizardContext) => {
      return new Promise((resolve) => {
        const runtimeList = Object.values(Runtime)
          .filter((runtime) => runtime !== undefined)
          .map((runtime: string | undefined) => {
            return new DefaultPickItem(runtime, runtime);
          });
        resolve(runtimeList);
      });
    },
    verifyPickItem: (
      item: any,
      _resolve: (value: PromiseLike<undefined> | undefined) => void,
      reject: (reason?: any) => void
    ) => {
      if (!!!item || /^\s*$/.test(item)) {
        reject("[Error] A Runtime is manatory.");
      }
    },
  });

  const rolePrompter = new PickPrompter({
    id: "role",
    title: "Select Role",
    loadItemsAsync: async (context: TWizardContext) => {
      let { Roles: roles } = await iamClient.send(new ListRolesCommand({}));
      return roles;
    },
    mapperToPickItem: (roles?: Role[]) => {
      return roles
        ?.filter((role) => {
          return hasRoleTrustedEntity(role, ENTITY_LAMBDA);
        })
        .map((role) => {
          return new DefaultPickItem(role.RoleName, role);
        });
    },
    verifyPickItem: (
      item: any,
      _resolve: (value: PromiseLike<undefined> | undefined) => void,
      reject: (reason?: any) => void
    ) => {
      if (!!!item || /^\s*$/.test(item)) {
        reject("[Error] A IAM Role for lambda function is manatory.");
      }
    },
  });

  const bucketPrompter = new PickPrompter({
    id: "bucket",
    title: "Select S3 Bucket",
    loadItemsAsync: async (context: TWizardContext) => {
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

  const objectPrompter = new PickPrompter({
    id: "s3object",
    title: "Select S3 Key",
    loadItemsAsync: async (context: TWizardContext) => {
      console.log(context);
      const bucket: Bucket = context.bucket;
      console.log(bucket);
      let { Contents: s3Objects } = await s3Client.send(
        new ListObjectsCommand({ Bucket: bucket.Name })
      );

      return s3Objects;
    },
    mapperToPickItem: (s3Objects) => {
      console.log(s3Objects);
      return s3Objects
        ?.filter((s3object: _Object) => {
          if (s3object.Key) {
            const key = s3object.Key;
            const ext = key.split(".").pop() || "";
            return ["jar", "war", "zip"].includes(ext);
          }
          return false;
        })
        .map((s3object) => {
          console.log(s3object);
          return new DefaultPickItem(s3object.Key, s3object);
        });
    },
    verifyPickItem: (
      item: any,
      _resolve: (value: PromiseLike<undefined> | undefined) => void,
      reject: (reason?: any) => void
    ) => {
      if (!!!item || /^\s*$/.test(item)) {
        // TODO: 람다 이름 정규식 추가
        reject("[Error] A S3 Object is mandatory.");
        // throw new Error("Doesn't match lambda name format");
      }
    },
  });

  const handlerPrompter = new InputPrompter({
    id: "handler",
    title:
      "Enter the lambda function's hander ( default - com.amazon.test.App::handleRequest )",
    placeHolder: "com.amazon.test.App::handleRequest",
  });

  const wizard = new DeployLambdaWizard({
    region: "ap-northeast-2",
    handler: "com.amazon.test.App::handleRequest",
  });

  wizard.addPrompter(namePrompter);
  wizard.addPrompter(descriptionrompter);
  wizard.addPrompter(runtimePrompter);
  wizard.addPrompter(rolePrompter);
  wizard.addPrompter(bucketPrompter);
  wizard.addPrompter(objectPrompter);
  wizard.addPrompter(handlerPrompter);

  let payload = await wizard.run();

  if (!payload) {
    return;
  }

  console.info(payload);

  lambdaClient
    .send(new CreateFunctionCommand(payload))
    .then((result) => {
      console.info(result);
      vscode.window.showInformationMessage(
        `[ SUCCESS ] Lambda Function ${result.FunctionName} ( ${result.FunctionArn} ) is deployed.`
      );

      vscode.commands.executeCommand("lambda.refreshEntry");
    })
    .catch((exception: InvalidParameterValueException) => {
      console.error(exception);
      vscode.window.showErrorMessage(exception.message);
    })
    .catch((exception: IAMServiceException) => {
      vscode.window.showErrorMessage(exception.message);
    })
    .catch((exception: ServiceException) => {
      vscode.window.showErrorMessage(exception.message);
    });
}
