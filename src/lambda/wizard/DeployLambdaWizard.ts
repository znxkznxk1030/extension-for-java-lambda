import { Wizard } from "../../wizard/wizard";

export type TWizardContext = {
  region: any;
  bucket: any;
  role: any;
  filepath: any;
}

export type TDeployLambdaPayload = {
  region: string;
  s3bucket: string;
  iamRoleArn: string;
  filePath: string;
};

export class DeployLambdaWizard extends Wizard<TWizardContext, TDeployLambdaPayload> {
  constructor() {
    super();
  }

  getResult(): TDeployLambdaPayload | undefined {
    try {
      console.log(this.payload);
      const result: TDeployLambdaPayload = {} as TDeployLambdaPayload;

      console.log("RESULT : ", result);

      return result;
    } catch (e) {
      console.error(e);
      // throw merging error
    }
  }
}
