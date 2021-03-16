#!/usr/bin/env node
import cloudfront = require('@aws-cdk/aws-cloudfront');
import route53 = require('@aws-cdk/aws-route53');
import s3 = require('@aws-cdk/aws-s3');
import s3deploy = require('@aws-cdk/aws-s3-deployment');
import acm = require('@aws-cdk/aws-certificatemanager');
import cdk = require('@aws-cdk/core');

import * as iam from '@aws-cdk/aws-iam';
import targets = require('@aws-cdk/aws-route53-targets/lib');
import { Construct, Duration } from '@aws-cdk/core';
import { DomainProps, getSiteDomain } from './common';



/**
 * Static site infrastructure, which deploys site content to an S3 bucket.
 *
 * The site redirects from HTTP to HTTPS, using a CloudFront distribution,
 * Route53 alias record, and ACM certificate.
 */
export class RecorderStaticSite extends cdk.Stack {
    constructor(parent: Construct, name: string, staticProps: DomainProps, props?: cdk.StackProps) {
        super(parent, name, props);

        const siteDomain = getSiteDomain(staticProps)
        const zone = route53.HostedZone.fromLookup(this, 'HostedZone', { domainName: siteDomain });

        new cdk.CfnOutput(this, 'HostedZoneIdOut', { value: zone.hostedZoneId });
        new cdk.CfnOutput(this, 'SiteDomainOut', { value: siteDomain });
        new cdk.CfnOutput(this, 'SiteOut', { value: 'https://' + siteDomain });

        // Content bucket
        const siteBucket = new s3.Bucket(this, 'SiteBucket', {
            bucketName: siteDomain,
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'index.html',
            publicReadAccess: false,
            removalPolicy: cdk.RemovalPolicy.RETAIN,
        });

        new cdk.CfnOutput(this, 'BucketNameOut', { value: siteBucket.bucketName });


        const oai = new cloudfront.OriginAccessIdentity(this, "originAccessIdentity")
        const s3Policy = new s3.BucketPolicy(this, "SiteBucketPolicy", { bucket : siteBucket})

        const oaiPolicyStatement = new iam.PolicyStatement();
        oaiPolicyStatement.addActions('s3:GetBucket*');
        oaiPolicyStatement.addActions('s3:GetObject*');
        oaiPolicyStatement.addActions('s3:List*');
        oaiPolicyStatement.addResources(siteBucket.bucketArn);
        oaiPolicyStatement.addResources(`${siteBucket.bucketArn}/*`);
        oaiPolicyStatement.addCanonicalUserPrincipal(oai.cloudFrontOriginAccessIdentityS3CanonicalUserId);
        s3Policy.document.addStatements(oaiPolicyStatement)

        // TLS certificate
        const certificateArn = new acm.DnsValidatedCertificate(this, 'SiteCertificate', {
            domainName: siteDomain,
            hostedZone: zone,
            region: 'us-east-1'
        }).certificateArn;

        new cdk.CfnOutput(this, 'CertificateArnOut', { value: certificateArn });

        // CloudFront distribution that provides HTTPS
        const distribution = new cloudfront.CloudFrontWebDistribution(this, 'SiteDistribution', {
            aliasConfiguration: {
                acmCertRef: certificateArn,
                names: [ siteDomain ],
                sslMethod: cloudfront.SSLMethod.SNI,
                securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2018,
            },
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: siteBucket,
                        originAccessIdentity: oai
                    },
                    behaviors : [ 
                        {
                            pathPattern: "/static/*",
                            isDefaultBehavior: false,
                            minTtl: Duration.days(365),
                            maxTtl: Duration.days(365),
                            defaultTtl: Duration.days(365)
                        },
                        {
                            pathPattern: "/media/*",
                            isDefaultBehavior: false,
                            minTtl: Duration.days(1),
                            maxTtl: Duration.days(1),
                            defaultTtl: Duration.days(1)
                        },
                        {
                            isDefaultBehavior: true,
                            minTtl: Duration.seconds(60),
                            maxTtl: Duration.seconds(60),
                            defaultTtl: Duration.seconds(60)
                        }
                    ],
                }
            ],
            errorConfigurations: [
                {
                    errorCode: 404,
                    responsePagePath: '/index.html',
                    responseCode: 200,
                    errorCachingMinTtl: 300
                },
                {
                    errorCode: 403,
                    responsePagePath: '/index.html',
                    responseCode: 200,
                    errorCachingMinTtl: 300
                },
        ]
        });
        new cdk.CfnOutput(this, 'DistributionIdOut', { value: distribution.distributionId });

        // Route53 alias record for the CloudFront distribution
        new route53.ARecord(this, 'SiteAliasRecord', {
            recordName: siteDomain,
            target: route53.AddressRecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
            zone
        });

        // Deploy site contents to S3 bucket
        new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
            sources: [ s3deploy.Source.asset('../recorder-ui/dist') ],
            destinationBucket: siteBucket,
            distribution,
            distributionPaths: ['/*'],
            retainOnDelete: false
          });
    }
}