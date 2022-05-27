import { PutObjectRequest } from "@aws-sdk/client-s3";
import { Wizard } from "../../wizard/wizard";

export type TUploadObjectWizardContext = {
  Bucket: string | undefined;
  Key: string;
};

export type TUploadObjectPayload = {
  filePath: string;
};

export class UploadObejctWizard extends Wizard<
  TUploadObjectWizardContext,
  PutObjectRequest
> {
  constructor(initialContext: Partial<TUploadObjectWizardContext>) {
    super();
    this.context = {
      ...initialContext,
    };
  }

  protected getResult(): PutObjectRequest | undefined {
    try {
      const putObejctRequest = {
        Bucket: "",
        Key: "",
      };

      console.log(this.context);
      return this.context as PutObjectRequest;
    } catch (e) {
      console.error(e);
      // throw merging error
      throw new Error("UploadObejctWizard | Invoked error while getResult");
    }
  }
}
