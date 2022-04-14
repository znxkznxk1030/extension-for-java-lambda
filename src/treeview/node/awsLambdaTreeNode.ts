export interface AWSLambdaNode {
  arn: string;
  name: string;
  role: string;
  runtime: string;
  packageType: string;
  handler: string;
  //
  description: string;
  memorySize: number | undefined;
  codeSize: number | undefined;

  // revisionId: string;
  // lastModified: string;
}
