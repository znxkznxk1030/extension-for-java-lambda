import { Wizard } from "../../wizard/wizard";

export type TDeployLambdaPayload = {
  region: string;
  s3bucket: string;
  iamRoleArn: string;
  filePath: string;
};

export class DeployLambdaWizard extends Wizard<TDeployLambdaPayload> {
  constructor() {
    super();
  }
  
  protected getResult(): TDeployLambdaPayload | undefined {
    // if (this.)

    console.log(this.payload);
    return ;
  }
}
