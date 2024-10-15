import * as pulumi from "@pulumi/pulumi";

const psgitConfig = new pulumi.Config("psgit");

const templateRepoSyncPat = psgitConfig.requireSecret("templateRepoSyncPat");

export { templateRepoSyncPat };
