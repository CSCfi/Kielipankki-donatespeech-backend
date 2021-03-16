import * as cdk from '@aws-cdk/core';
import s3 = require('@aws-cdk/aws-s3');
import acm = require('@aws-cdk/aws-certificatemanager');
import route53 = require('@aws-cdk/aws-route53');
import { DomainProps, getSiteDomain } from './common';

export class RecorderBackendResources extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, domainProps: DomainProps, props?: cdk.StackProps) {
    super(scope, id, props);

    const env = process.env['ENV']
    const siteDomain = getSiteDomain(domainProps)

    // Content bucket
    const contentBucket = new s3.Bucket(this, 'ContentBucket', {
        bucketName: "recorder-content-" + env,
        removalPolicy: cdk.RemovalPolicy.RETAIN,
        publicReadAccess: false,
        cors: [
          {
            allowedMethods: [
              s3.HttpMethods.PUT
            ],
            allowedHeaders: [
              "Content-Type", 
            ],
            allowedOrigins: ['*'],
            maxAge: 600
          }
        ]
    });

    const zone = route53.HostedZone.fromLookup(this, 'HostedZone', { domainName: siteDomain });

        // TLS certificate
    const certificateArn = new acm.DnsValidatedCertificate(this, 'SiteCertificate', {
        domainName: "endpoint." + siteDomain,
        hostedZone: zone,
        region: 'us-east-1'
    }).certificateArn;

    new cdk.CfnOutput(this, 'ContentBucketNameOut', { value: contentBucket.bucketName });
    new cdk.CfnOutput(this, 'ContentBucketArnOut', { value: contentBucket.bucketArn });
    new cdk.CfnOutput(this, 'EndpointCertificateArnOut', { value: certificateArn });

  }
}