import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import codebuild = require('@aws-cdk/aws-codebuild');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import codepipelineActions = require('@aws-cdk/aws-codepipeline-actions');
import { Artifact } from '@aws-cdk/aws-codepipeline';
import { Duration } from '@aws-cdk/core';
import { LinuxBuildImage, BuildSpec } from '@aws-cdk/aws-codebuild';

export class RecorderCI extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const env = process.env['ENV'] || 'dev'
    const branch = process.env['BRANCH'] || 'master'

    const githubArtifact = Artifact.artifact("GithubArtifact")
    const serverlessArtifact = Artifact.artifact('ServerlessArtifact');

    const pipeline = new codepipeline.Pipeline(this, 'Recorder backend and frontend');

    const oauth = cdk.SecretValue.secretsManager('/github/oauthtoken', {
      jsonField: 'oAuthToken',
    });

    const githubAction = new codepipelineActions.GitHubSourceAction({
        actionName: "Source",
        output: githubArtifact,
        owner: "<github-user-name>",
        repo: "recorder-backend",
        branch: branch,
        oauthToken: oauth
    });

    pipeline.addStage({
      stageName: 'Source',
      actions: [githubAction]
    });


    const serverlessBuildRole = new iam.Role(this, 'BuildRole', {
      assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com')
    });

    serverlessBuildRole.addToPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: [
        's3:*',
        'iam:*',
        'kms:*',
        'logs:*',
        'acm:*',
        'cloudwatch:*',
        'codebuild:*',
        'cloudfront:*',
        'cloudformation:*',
        'apigateway:*',
        'lambda:*',
        'ssm:*',
        'ec2:*',
        'route53:*',
        'wafv2:*',
      ] 
    }));

    const serverlessBuild = new codebuild.PipelineProject(this, "Serverless build and deploy", {
      buildSpec: BuildSpec.fromSourceFilename('serverless_build_spec.yml'),
      environment: {
        buildImage: LinuxBuildImage.STANDARD_2_0,
        privileged: true,
        environmentVariables: {
          ENV: {
            type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: env
          },
          BRANCH: {
            type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: branch
          },
        }
      },
      role: serverlessBuildRole,
      timeout: Duration.minutes(60)
    }) 

    
    pipeline.addStage({
      stageName: 'BuildAndDeployServerless',
      actions: [
        new codepipelineActions.CodeBuildAction({
          actionName: 'RunServerless',
          project: serverlessBuild,
          input: githubArtifact,
          outputs: [serverlessArtifact]
        })
      ]
    });

  }
}
