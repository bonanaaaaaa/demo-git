import * as pulumi from "@pulumi/pulumi";

const demo2Config = new pulumi.Config("demo2");

const repositoryName = demo2Config.require("repositoryName");
const repositoryDescription = demo2Config.require("repositoryDescription");

export { repositoryName, repositoryDescription };
