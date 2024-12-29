#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { DeployStack } from '../lib/stack'


const app = new cdk.App();
new DeployStack(app, 'TestStack');