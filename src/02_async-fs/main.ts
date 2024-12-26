import { getDefaultPort } from "../shared";
import { getPortFromConfig } from "./services/port-config.service";

const bootstrap = async () => {
  const port = await getPortFromConfig();
  console.log(`Configured port is: <<<${port}>>>`);
};

bootstrap().catch((error) => {
  console.error("Error reading file:", error);
  console.log(`Using default value: <<<${getDefaultPort()}>>>`);
});
