import { ListRolesCommand, Role } from "@aws-sdk/client-iam";
import { iamClient } from "../../clients/iamClient";
import { hasRoleTrustedEntity, ENTITY_LAMBDA } from "../utils";
import { AWSTreeDataProvider } from "../../treeview/AwsTreeDataProvider";
import { AWSIamRoleTreeNode } from "./IAMRoleTreeNode";
import { AWSTreeNodeBase } from "../../treeview/node/TreeNodeBase";

export class IAMRoleExplorer extends AWSTreeDataProvider {
  constructor() {
    super();
  }

  async listChildren(): Promise<AWSTreeNodeBase[]> {
    let { Roles: roles } = await iamClient.send(new ListRolesCommand({}));

    let awsBucketTreeNode = roles
      ?.filter((role) => {
        return hasRoleTrustedEntity(role, ENTITY_LAMBDA);
      })
      .map((role) => {
        const _role = {
          roleId: role.RoleId || "",
          roleName: role.RoleName || "",
          arn: role.Arn || "",
          path: role.Path || "",
          assumeRolePolicyDocument: role.AssumeRolePolicyDocument || "",

          maxSessionDuration: role.MaxSessionDuration,
          description: role.Description,
          createDate: role.CreateDate,
        };

        return new AWSIamRoleTreeNode(_role);
      });

    return awsBucketTreeNode || [];
  }
}
