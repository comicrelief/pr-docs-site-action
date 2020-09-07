/* eslint-disable import/no-extraneous-dependencies */
import { readdirSync, statSync } from 'fs';
import * as path from 'path';

import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { lookup } from 'mime-types';



if (!process.env.GITHUB_REPOSITORY) {
  throw new Error('GITHUB_REPOSITORY is undefined.');
}

if (!process.env.GITHUB_REF) {
  throw new Error('GITHUB_REF is undefined.');
}

const GIT_REPO_NAME = process.env.GITHUB_REPOSITORY.replace(/\W+/g, '-');
const GIT_BRANCH = (process.env.GITHUB_REF.split("/").pop() ?? 'unknown').replace(/\W+/g, '-');
const PROJECT_PATH = `docs-${GIT_REPO_NAME}-${GIT_BRANCH}`;
const WEBSITE_ROOT = '.';

interface PathRef {
  postfix: string;
  filepath: string;
}


/**
 * Create an S3 Bucket Policy to allow
 * public read of all objects in bucket
 */
const getPolicy = (bucketName: string) => JSON.stringify({
  Version: '2012-10-17',
  Statement: [{
    Effect: 'Allow',
    Principal: '*',
    Action: [
      's3:GetObject',
    ],
    Resource: [
      `arn:aws:s3:::${bucketName}/*`,
    ],
  }],
});

/**
 * Recursevely generate a list of files
 */
const getFiles = (subfolder = '') => {
  const paths: PathRef[] = [];

  readdirSync(path.join(WEBSITE_ROOT, subfolder)).forEach((name) => {
    const postfix = path.join(subfolder, name);
    const filepath = path.join(WEBSITE_ROOT, postfix);

    if (statSync(filepath).isDirectory()) {
      getFiles(postfix).forEach(subpath => paths.push(subpath));
    } else {
      paths.push({ postfix, filepath });
    }
  });

  return paths;
};

/**
 * Executes the setup and returns
 * the generated resources.
 */
const setup = () => {
  const bucket = new aws.s3.Bucket(PROJECT_PATH, {
    bucket: PROJECT_PATH,
    website: {
      indexDocument: 'index.html',
    },
  });

  const bucketPolicy = new aws.s3.BucketPolicy('bucketPolicy', {
    bucket: bucket.bucket,
    policy: bucket.bucket.apply(getPolicy),
  });

  const uploads = getFiles().map(({ postfix, filepath }) => new aws.s3.BucketObject(postfix, {
    bucket,
    source: new pulumi.asset.FileAsset(filepath),
    contentType: lookup(filepath) || undefined,
  }));

  return {
    bucket,
    uploads,
    bucketPolicy,
  };
};

const { bucket } = setup();

export const bucketName = bucket.id;
export const websiteUrl = bucket.websiteEndpoint;
