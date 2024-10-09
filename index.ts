import * as psgit from "./modules/demo";
import { PsGitHubProvider } from "./providers/psgit";

const psGitResource = new PsGitHubProvider("psgit", {
  repository: {
    name: psgit.repositoryName,
    description: psgit.repositoryDescription,
  },
});

export default {
  psGitResource,
};
