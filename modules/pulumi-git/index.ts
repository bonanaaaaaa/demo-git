import * as demo from "./modules/demo";
import * as demo2 from "./modules/demo2";
import { PsGitHubProvider } from "./providers/psgit";

const demoResource = new PsGitHubProvider(demo.repositoryName, {
  repository: {
    name: demo.repositoryName,
    description: demo.repositoryDescription,
  },
});

const demo2Resource = new PsGitHubProvider(demo2.repositoryName, {
  repository: {
    name: demo2.repositoryName,
    description: demo2.repositoryDescription,
  },
});

export default {
  demoResource,
  demo2Resource,
};
