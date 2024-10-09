import * as github from "@pulumi/github";
import { ComponentResource, ResourceOptions } from "@pulumi/pulumi";

type GitHubArgs = {
  repository: {
    name: string;
    description: string;
  };
  actionsSecret?: github.ActionsSecretArgs;
};

const mainBranchName = "main";
const devBranchName = "dev";

export class PsGitHubProvider extends ComponentResource {
  repository: github.Repository;

  devBranch: github.Branch;

  devBranchProtection: github.BranchProtection;
  mainBranchProtection: github.BranchProtection;

  constructor(name: string, args: GitHubArgs, opts?: ResourceOptions) {
    const { repository } = args;

    super("PsGitHub", name, args, opts);

    this.repository = this.createRepository({
      name: repository.name,
      autoInit: true,
      description: repository.description,
    });

    this.devBranch = this.createBranch({ branchName: devBranchName });

    this.devBranchProtection = this.createBranchProtection({
      branchName: devBranchName,
      pattern: devBranchName,
    });
    this.mainBranchProtection = this.createBranchProtection({
      branchName: mainBranchName,
      pattern: mainBranchName,
    });

    this.registerOutputs({
      repository: this.repository,
      devBranch: this.devBranch,
      devBranchProtection: this.devBranchProtection,
      mainBranchProtection: this.mainBranchProtection,
    });
  }

  createRepository({ name, description }: github.RepositoryArgs) {
    const repo = new github.Repository(`${name}-repository`, {
      name: name,
      description: description,
      allowAutoMerge: true,
      allowMergeCommit: false,
      allowRebaseMerge: false,
      allowSquashMerge: true,
      deleteBranchOnMerge: true,
      template: {
        owner: "bonanaaaaaa",
        repository: "demo-template",
      },
    });

    return repo;
  }

  createBranch({ branchName }: { branchName: string }) {
    return new github.Branch(
      `${branchName}-branch`,
      {
        repository: this.repository.name,
        branch: branchName,
      },
      { parent: this.repository }
    );
  }

  createBranchProtection({
    pattern,
    branchName,
  }: {
    pattern: string;
    branchName: string;
  }) {
    const branchRule: github.BranchProtectionArgs = {
      repositoryId: this.repository.nodeId,
      pattern: pattern,
      enforceAdmins: true,
      blocksCreations: true,
      allowsDeletions: false,
      requiredStatusChecks: [
        {
          strict: true,
          contexts: ["ci"],
        },
      ],
      requiredPullRequestReviews: [
        {
          requireCodeOwnerReviews: true,
          requiredApprovingReviewCount: 1,
        },
      ],
      requireConversationResolution: true,
      requireSignedCommits: true,
      allowsForcePushes: false,
    };

    return new github.BranchProtection(
      `${branchName}-branch-protection`,
      branchRule,
      { parent: this.repository }
    );
  }
}
