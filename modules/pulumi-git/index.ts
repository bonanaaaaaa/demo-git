import * as demo from "./modules/demo";
import * as demo2 from "./modules/demo2";
import * as psgit from "./modules/psgit";
import { PsGitHubProvider } from "./providers/psgit";

const demoResource = new PsGitHubProvider(demo.repositoryName, {
  repository: {
    name: demo.repositoryName,
    description: demo.repositoryDescription,
  },
  templateRepoSyncPat: psgit.templateRepoSyncPat,
});

const demo2Resource = new PsGitHubProvider(demo2.repositoryName, {
  repository: {
    name: demo2.repositoryName,
    description: demo2.repositoryDescription,
  },
  templateRepoSyncPat: psgit.templateRepoSyncPat,
});

export default {
  demoResource,
  demo2Resource,
};
