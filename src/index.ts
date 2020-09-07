import { writePulumiFile, writePulumiStackFile } from './prepare';

const main = () => {
  if (!process.env.AWS_REGION) {
    throw new Error('AWS_REGION is required');
  }

  if (!process.env.PROJECT_NAME) {
    throw new Error('PROJECT_NAME is required.');
  }

  const stack = process.env.STACK_NAME || 'dev';


  writePulumiFile(process.env.PROJECT_NAME);
  writePulumiStackFile(stack, process.env.AWS_REGION);
}


main();
