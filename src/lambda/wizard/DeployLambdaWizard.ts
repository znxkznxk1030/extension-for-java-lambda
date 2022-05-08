/* eslint-disable @typescript-eslint/naming-convention */
import { CreateFunctionCommandInput } from "@aws-sdk/client-lambda";
import { Wizard } from "../../wizard/wizard";

export type TWizardContext = {
  name: any;
  description: any;
  region: any;
  bucket: any;
  role: any;
  file: any;
  runtime: any;
  handler: any;
};

export type TDeployLambdaPayload = {
  name: string;
  description: string;
  region: string;
  s3bucket: string;
  role: string;
  file: string;
  runtime: string;
  handler: string;
};

export class DeployLambdaWizard extends Wizard<
  TWizardContext,
  CreateFunctionCommandInput
> {
  constructor(initialContext: Partial<TWizardContext>) {
    super();
    this.context = {
      ...initialContext,
    };
  }

  getResult(): CreateFunctionCommandInput | undefined {
    try {

      const payloadCreateFunction = {
        FunctionName: this.context.name,
        Role: this.context.role.Arn,
        Code: {
          S3Bucket: this.context.bucket.Name,
          S3Key: this.context.file,
        },
        Runtime: this.context.runtime,
        Handler: this.context.handler,
      };

      return payloadCreateFunction;
    } catch (e) {
      console.error(e);
      // throw merging error
    }
  }
}
