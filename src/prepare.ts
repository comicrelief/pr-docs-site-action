import { writeFileSync } from 'fs';
import * as path from 'path';


export const BUILD_DIR = path.join(__dirname, "pulumi");

export const getPulumiStageFile = (region: string) => `
config:
  aws:region: ${region}
`;

export const getPulumiFile = (name: string) => `
name: pr-docs-website-generator-for-${name}
runtime: nodejs
description: Pull request documentation website generator for '${name}'.
`;


export const writePulumiStackFile = (stack: string, region: string) => {
  const filepath = path.join(BUILD_DIR, `Pulumi.${stack}.yaml`);
  const content = getPulumiStageFile(region);

  writeFileSync(filepath, content);
}

export const writePulumiFile = (name: string) => {
  const filepath = path.join(BUILD_DIR, 'Pulumi.yaml');
  const content = getPulumiFile(name);

  writeFileSync(filepath, content);
}
