# Recorder CDK deployment

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile Typescript to JavaScript
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the Jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emit the synthesized CloudFormation template

## How to create an environment from scratch

### Parameters and secrets to store to the accounts

#### Parameter store SSM keys

| Key | Value |
|-----|-------|
| /yle/client/id | Yle application id as plain text |
| /yle/client/key | Yle application key as plain text |
| /yle/decrypt | Yle decrypt key USE SecureString |

#### SecretsManager

| Key | Value |
|-----|-------|
| /github/oauthtoken |  { "oAuthToken" : [TOKEN] } |

#### Create hosted zones manually and provision CI pipeline using CDK

Create the needed hosted zone e.g. example.com and direct the domain to that DNS server.

When the needed parameters and secrets are set go to the `cdk` folder and run

```bash
npm run build
export ENV=prod
export BRANCH=master
cdk deploy RecorderBackendCI --profile [AWS-PROFILE-FOR_TARGET_ACCOUNT]
```

When the deployment is done, WAF needs to be attached to the CloudFront distribution manually ATM. So do this now.

After the production account is created, create the hosted zone for the dev environment and then create the NS record 
to production to point to the dev env hosted zone.

```bash
export ENV=dev
export BRANCH=dev
cdk deploy RecorderBackendCI --profile [AWS-PROFILE-FOR_TARGET_ACCOUNT]
```

And you should be done!
