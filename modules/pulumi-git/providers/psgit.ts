import * as pulumi from "@pulumi/pulumi";
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

  devRepositoryRuleset: github.RepositoryRuleset;
  mainRepositoryRuleset?: github.RepositoryRuleset;

  private baseRepositoryRuleset: github.RepositoryRulesetArgs = {
    target: "branch",
    enforcement: "active",
    rules: {
      // branchNamePattern: {
      //   operator: "regex",
      //   pattern: `^${branchName}$`,
      //   name: branchName,
      // },
      creation: true,
      update: true,
      deletion: true,
      // commitAuthorEmailPattern: {
      //   operator: "regex",
      //   pattern: ".*@(amitysolutions\\.com|amity\\.co)$",
      // },
      pullRequest: {
        requireCodeOwnerReview: true,
        requiredApprovingReviewCount: 1,
        requiredReviewThreadResolution: true,
      },
      requiredSignatures: true,
      requiredStatusChecks: {
        requiredChecks: [
          {
            context: "ci",
          },
        ],
        strictRequiredStatusChecksPolicy: true,
      },
    },
  };

  constructor(name: string, args: GitHubArgs, opts?: ResourceOptions) {
    const { repository } = args;

    super("PsGitHub", name, args, opts);

    this.repository = this.createRepository({
      name: repository.name,
      autoInit: true,
      description: repository.description,
    });

    this.devBranch = this.createBranch({ branchName: devBranchName });

    this.mainRepositoryRuleset = this.createDefaultRepositoryRuleset();

    this.devRepositoryRuleset = this.createRepositoryRuleset({
      branch: this.devBranch,
      branchName: devBranchName,
    });

    this.registerOutputs({
      repository: this.repository,
      devBranch: this.devBranch,
      devRepositoryRuleset: this.devRepositoryRuleset,
      mainRepositoryRuleset: this.mainRepositoryRuleset,
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

  createDefaultRepositoryRuleset() {
    return new github.RepositoryRuleset(
      `${mainBranchName}-repository-ruleset`,
      {
        name: mainBranchName,
        repository: this.repository.name,
        conditions: {
          refName: {
            includes: ["~DEFAULT_BRANCH"],
            excludes: [],
          },
        },
        ...this.baseRepositoryRuleset,
      },
      {
        parent: this.repository,
      }
    );
  }

  createRepositoryRuleset({
    branch,
    branchName,
  }: {
    branch: github.Branch;
    branchName: string;
  }) {
    const rulesetArgs: github.RepositoryRulesetArgs = {
      name: branchName,
      repository: this.repository.name,
      conditions: {
        refName: {
          includes: [branch.ref],
          excludes: [],
        },
      },
      ...this.baseRepositoryRuleset,
    };

    return new github.RepositoryRuleset(
      `${branchName}-repository-ruleset`,
      rulesetArgs,
      {
        parent: branch,
      }
    );
  }
}
