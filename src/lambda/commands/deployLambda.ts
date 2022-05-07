import * as vscode from "vscode";
import { ListRolesCommand, Role } from "@aws-sdk/client-iam";
import { iamClient } from "../../clients/iamClient";
import { DefaultPickItem, PickPrompter } from "../../ui/prompter";
import { s3Client } from "../../clients/s3Client";
import { Bucket, ListBucketsCommand } from "@aws-sdk/client-s3";
import { ENTITY_LAMBDA, hasRoleTrustedEntity } from "../../iam/utils";
import { DeployLambdaWizard } from "../wizard/DeployLambdaWizard";

export async function deployLambdaFunction() {
  const rolePrompter = new PickPrompter({
    id: "role",
    title: "Select Role",
    loadItemsAsync: async () => {
      let { Roles } = await iamClient.send(new ListRolesCommand({}));
      return Roles;
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
    loadItemsAsync: async () => {
      let { Buckets } = await s3Client.send(new ListBucketsCommand({}));

      return Buckets;
    },
    mapperToPickItem: (bucketList?: Bucket[]) => {
      return bucketList?.map((bucket) => {
        return new DefaultPickItem(bucket.Name, bucket);
      });
    },
  });

  const wizard = new DeployLambdaWizard();

  wizard.addPrompter(rolePrompter);
  wizard.addPrompter(bucketPrompter);

  wizard.run();

  console.log(wizard.getResult());
}