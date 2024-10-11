import * as demo from "./modules/demo";
import { PsGitHubProvider } from "./providers/psgit";

const demoResource = new PsGitHubProvider(demo.repositoryName, {
  repository: {
    name: demo.repositoryName,
    description: demo.repositoryDescription,
  },
});

export default {
  demoResource,
};
