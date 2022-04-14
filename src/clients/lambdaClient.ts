import {
  LambdaClient,
  AddLayerVersionPermissionCommand,
} from "@aws-sdk/client-lambda";

const DEFAULT_REGION = "ap-northeast-2";

export const lambdaClient = new LambdaClient({ region: DEFAULT_REGION });
