import * as vscode from "vscode";
import { ListRolesCommand, Role } from "@aws-sdk/client-iam";
import { iamClient } from "../../clients/iamClient";
import { PickPrompter } from "../../ui/prompter";
import { s3Client } from "../../clients/s3Client";
import { Bucket, ListBucketsCommand } from "@aws-sdk/client-s3";
import { ENTITY_LAMBDA, hasRoleTrustedEntity } from "../../iam/utils";

export async function deployLambdaFunction() {
  const rolePrompter = new PickPrompter({
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

  const response = await rolePrompter.interact();
  console.log("Selected Role : " + JSON.stringify(response));


  const bucketPrompter = new PickPrompter({
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

  const response2 = await bucketPrompter.interact();
  console.log("Selected Bucket : " + JSON.stringify(response2));
}

class DefaultPickItem implements vscode.QuickPickItem {
  public readonly label: string;
  public readonly data: object | string | number | undefined;

  constructor(name?: string, data?: object) {
    this.label = name || "[Anonymous]";
    this.data = data;
  }
}