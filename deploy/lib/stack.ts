import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
 
export class DeployStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 1 });
    const loadBalancer = new elbv2.ApplicationLoadBalancer(this, 'LoadBalancer', {
      vpc,
      internetFacing: true
    });
    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc
    });


    new ApplicationLoadBalancedFargateService(this, 'Service', {
      taskImageOptions: {
        image: ecs.ContainerImage.fromEcrRepository(
          ecr.Repository.fromRepositoryName(this, 'Repository', 'my-ecr-repo'),
          "todo image tag"
        ),
      },
      cluster,
      loadBalancer,
      assignPublicIp: true,
      deploymentController: {
        type: ecs.DeploymentControllerType.CODE_DEPLOY
      }
    });
  }
}