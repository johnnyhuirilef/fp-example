import { getPortFromConfig$ } from "./services/port-config.service";
import { getDefaultPort } from "../shared";

const bootstrap = () => {
  getPortFromConfig$().subscribe({
    next: (port) => console.log(`Configured port is: <<<${port}>>>`),
    error: (error) => {
      console.log("Error reading file:", error);
      console.log(`Configured port is: <<<${getDefaultPort()}>>>`);
    },
  });
};

bootstrap();
