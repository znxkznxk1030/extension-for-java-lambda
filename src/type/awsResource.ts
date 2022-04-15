export type AWSRole = {
  roleId: string;
  roleName: string;
  arn: string;
  maxSessionDuration: number | undefined;
  path: string;

  description: string | undefined;
  createDate: Date | string | undefined;
};

export interface Policy {}
