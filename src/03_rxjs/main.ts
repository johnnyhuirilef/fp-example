import { getPortFromConfig$ } from "./services/port-config.service";

const bootstrap = () => {
  getPortFromConfig$().subscribe({
    next: (port) => console.log(`Configured port is: <<<${port}>>>`),
    error: (error) => console.log("Error reading file:", error),
  });
};

bootstrap();
