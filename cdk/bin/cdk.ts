#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { RecorderCI } from '../lib/recorder-ci';
import { RecorderBackendResources } from '../lib/recorder-backend-resources';
import { RecorderWAF } from '../lib/recorder-waf';
import { RecorderStaticSite } from '../lib/recorder-frontend-hosting';

const app = new cdk.App();

const env = process.env['ENV'] || 'dev'

let subdomain = ""

if(env === 'dev') subdomain = "dev"

const domain = "example.com"

new RecorderCI(app, 'RecorderBackendCI', { env: { 
    region: 'eu-west-1'
}});

const euRegion = { 
                    env: { 
                        region: 'eu-west-1',
                        account: process.env['CDK_DEFAULT_ACCOUNT']
                    }
                 }

const usRegion = { env: { 
                        region: 'us-east-1',
                        account: process.env['CDK_DEFAULT_ACCOUNT']
                  }}

new RecorderBackendResources(app, 'RecorderBackendResources', { 
        domainName : domain, 
        siteSubDomain : subdomain,
    }, euRegion);

new RecorderWAF(app, 'RecorderWAF', usRegion);

new RecorderStaticSite(app, "RecorderStaticSite", { 
        domainName : domain, 
        siteSubDomain : subdomain,
    }, euRegion)
