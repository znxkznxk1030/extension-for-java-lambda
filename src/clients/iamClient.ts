import {
  IAMClient,
  AddClientIDToOpenIDConnectProviderCommand,
} from "@aws-sdk/client-iam";

const DEFAULT_REGION = "ap-northeast-2";

export const iamClient = new IAMClient({ region: DEFAULT_REGION });
