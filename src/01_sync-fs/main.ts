import { getDefaultPort } from "../shared";
import { getPortFromConfig } from "./services/port-config.service";

const bootstrap = () => {
  try {
    const port = getPortFromConfig("config.json");
    console.log(`Configured port is: <<<${port}>>>`);
  } catch (error) {
    console.error("Error reading file or parsing JSON:", error);
    console.log(`Using default value: <<<${getDefaultPort()}>>>`);
  }
};

bootstrap();
