import * as pulumi from "@pulumi/pulumi";

const demoConfig = new pulumi.Config("demo");

const repositoryName = demoConfig.require("repositoryName");
const repositoryDescription = demoConfig.require("repositoryDescription");

export { repositoryName, repositoryDescription };
