/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from "vscode";
import { ListRolesCommand, Role } from "@aws-sdk/client-iam";
import { iamClient } from "../../clients/iamClient";
import { DefaultPickItem, PickPrompter } from "../../ui/prompter";
import { s3Client } from "../../clients/s3Client";
import { Bucket, ListBucketsCommand } from "@aws-sdk/client-s3";
import { ENTITY_LAMBDA, hasRoleTrustedEntity } from "../../iam/utils";
import {
  DeployLambdaWizard,
  TDeployLambdaPayload,
  TWizardContext,
} from "../wizard/DeployLambdaWizard";
import { Account, config, Config } from "aws-sdk";
import { lambdaClient } from "../../clients/lambdaClient";
import { CreateFunctionCommand } from "@aws-sdk/client-lambda";

export async function deployLambdaFunction() {
  console.log(Config);

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
    title: "Select Bucket",
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

  const wizard = new DeployLambdaWizard({
    name: "test-lambda-function",
    description: "test to deploy lambda function",
    region: "ap-northeast-2",
    runtime: "java11",
    file: "hello-lambda.jar",
    handler: "com.amazon.test.App::handleRequest",
  });

  wizard.addPrompter(rolePrompter);
  wizard.addPrompter(bucketPrompter);

  let payload = await wizard.run();

  if (!payload) {
    return;
  }

  console.log(payload);

  lambdaClient.send(new CreateFunctionCommand(payload));
}
