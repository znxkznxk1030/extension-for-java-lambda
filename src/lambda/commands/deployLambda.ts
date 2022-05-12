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
import { Bucket, ListBucketsCommand, ListObjectsCommand, _Object } from "@aws-sdk/client-s3";
import { ENTITY_LAMBDA, hasRoleTrustedEntity } from "../../iam/utils";
import {
  DeployLambdaWizard,
  TDeployLambdaPayload,
  TWizardContext,
} from "../wizard/DeployLambdaWizard";
import { Account, config, Config } from "aws-sdk";
import { lambdaClient } from "../../clients/lambdaClient";
import {
  CreateFunctionCommand,
  InvalidParameterValueException,
  ServiceException,
} from "@aws-sdk/client-lambda";
import { Object } from "aws-sdk/clients/s3";

export async function deployLambdaFunction() {
  const namePrompter = new InputPrompter({
    id: "name",
    title: "Enter the lambda function name",
  });

  const descriptionrompter = new InputPrompter({
    id: "Description",
    title: "Describe the lambda function",
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
  });

  const objectPrompter = new PickPrompter({
    id: "s3object",
    title: "Select S3 Key",
    loadItemsAsync: async (context: TWizardContext) => {
      console.log(context);
      // const bucket:Bucket = context.bucket;
      let { Contents: s3Objects } = await s3Client.send(
        new ListObjectsCommand({ Bucket: context.bucket.Arn })
      );

      return s3Objects;
    },
    mapperToPickItem: (s3Objects) => {
      console.log(s3Objects);
      return s3Objects?.map((s3object) => {
        return new DefaultPickItem(s3object.Key, s3object);
      });
    },
  });

  const wizard = new DeployLambdaWizard({
    name: "test-lambda-function",
    description: "test to deploy lambda function",
    region: "ap-northeast-2",
    runtime: "java11",
    file: "hello-lambda.jar",
    handler: "com.amazon.test.App::handleRequest",
  });

  wizard.addPrompter(namePrompter);
  wizard.addPrompter(descriptionrompter);
  wizard.addPrompter(rolePrompter);
  wizard.addPrompter(bucketPrompter);
  wizard.addPrompter(objectPrompter);

  let payload = await wizard.run();

  if (!payload) {
    return;
  }

  console.log(payload);

  lambdaClient
    .send(new CreateFunctionCommand(payload))
    .catch((exception: InvalidParameterValueException) => {
      vscode.window.showErrorMessage(exception.message);
    })
    .catch((exception: IAMServiceException) => {
      vscode.window.showErrorMessage(exception.message);
    })
    .catch((exception: ServiceException) => {
      vscode.window.showErrorMessage(exception.message);
      console.log("another exception");
    });
}
