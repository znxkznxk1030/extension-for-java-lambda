export interface AWSIAMRoleNode {
  arn: string;
  name: string;
  description: string;
  roleId: string;
  createDate: string;
}

import {
  GetRolePolicyCommand,
  ListAttachedRolePoliciesCommand,
  ListPoliciesCommand,
  ListRolePoliciesCommand,
} from "@aws-sdk/client-iam";
import { Policy } from "aws-sdk/clients/iam";
import path = require("path");
import { TreeItemCollapsibleState } from "vscode";
import { iamClient } from "../../clients/iamClient";
import { AWSRole } from "../../type/awsResources";
import { AWSIAMPolicyTreeNode } from "./IAMPolicyTreeNode";
import { AWSTreeNodeBase } from "../../treeview/node/TreeNodeBase";

export class AWSIamRoleTreeNode extends AWSTreeNodeBase {
  private readonly role: AWSRole | undefined;

  public constructor(role: AWSRole) {
    super(role.roleName, TreeItemCollapsibleState.Collapsed);
    this.role = role;
    this.tooltip = role.description;
    this.contextValue = "awsBucketNode";
  }

  public async getChildren(): Promise<AWSTreeNodeBase[]> {
    return await this.listAWSPolicy();
  }

  private async listAWSPolicy(): Promise<AWSTreeNodeBase[]> {
    const roleName = this.role?.roleName;
    console.log(roleName);

    let { AttachedPolicies: attachedPolicies } =
      (await iamClient.send(
        new ListAttachedRolePoliciesCommand({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          RoleName: roleName,
        })
      )) || [];

    return (
      attachedPolicies?.map((policy: Policy): AWSIAMPolicyTreeNode => {
        const policyName = policy.PolicyName || "";
        return new AWSIAMPolicyTreeNode(this, policyName, policyName);
      }) || []
    );
  }

  iconPath = path.join(__dirname, "..", "media", "aws-iam-role.svg");
}
