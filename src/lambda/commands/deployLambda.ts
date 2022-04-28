import * as vscode from "vscode";
import { ListRolesCommand } from "@aws-sdk/client-iam";
import { iamClient } from "../../clients/iamClient";
import { PickPrompter } from "../../ui/prompter";
import { s3Client } from "../../clients/s3Client";
import { ListBucketsCommand } from "@aws-sdk/client-s3";

export async function deployLambdaFunction() {
  let { Roles: roles } = await iamClient.send(new ListRolesCommand({}));

  const roleItems = roles?.map((role) => {
    return new DefaultPickItem(role.RoleName, role);
  });

  const picker = vscode.window.createQuickPick<DefaultPickItem>();

  picker.title = "Select Role";

  if (roleItems) {
    picker.items = roleItems;
  }

  const prompter = new PickPrompter(picker, {});
  const response = await prompter.interact();
  console.log("Selected Role : " + JSON.stringify(response));





  
  let { Buckets: bucketList } = await s3Client.send(new ListBucketsCommand({}));

  const bucketItems = bucketList?.map((bucket) => {
    return new DefaultPickItem(bucket.Name, bucket);
  });

  const picker2 = vscode.window.createQuickPick<DefaultPickItem>();

  picker2.title = "Select Bucket";

  if (bucketItems) {
    picker2.items = bucketItems;
  }

  const prompter2 = new PickPrompter(picker2, {});
  const response2 = await prompter2.interact();
  console.log("Selected Bucket : " + JSON.stringify(response2));

}

class QuickPickRoleItem implements vscode.QuickPickItem {
  public readonly label: string;
  public readonly arn?: string;
  public readonly data: object | string | number | undefined;

  constructor(name: string, arn: string | undefined, role?: object) {
    this.label = name;
    this.arn = arn;
    this.data = role;
  }
}

class DefaultPickItem implements vscode.QuickPickItem {
  public readonly label: string;
  public readonly data: object | string | number | undefined;

  constructor(name?: string, data?: object) {
    this.label = name || "[Anonymous]";
    this.data = data;
  }
}
