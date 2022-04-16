import { Role } from "@aws-sdk/client-iam";

export const ENTITY_LAMBDA = "lambda.amazonaws.com";

export function hasRoleTrustedEntity(role: Role, entity: string): boolean {
  const statements =
    JSON.parse(decodeURIComponent(role.AssumeRolePolicyDocument || ""))
      ?.Statement || [];

  for (const statement of statements) {
    const trustedEntity = statement.Principal?.Service;

    if (trustedEntity === entity) {
      return true;
    }
  }
  return false;
}
