export type AWSS3Bucket = {};
export type AWSS3Object = {};

export type AWSLambda = {};

export type AWSRole = {
  roleId: string;
  roleName: string;
  arn: string;
  maxSessionDuration: number | undefined;
  assumeRolePolicyDocument: string;
  path: string;

  description: string | undefined;
  createDate: Date | string | undefined;
};

export type AWSPolicy = {};
