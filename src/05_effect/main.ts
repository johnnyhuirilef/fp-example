import { Effect } from "effect";
import { getPortFromConfig } from "./services/port-config.service";
import { getDefaultPort } from "../shared";

const bootstrap = () =>
  Effect.runPromise(
    Effect.catchAll(getPortFromConfig(), (error) => {
      console.error(error);
      return Effect.succeed(getDefaultPort());
    })
  ).then((port) => {
    console.log(`Configured port is: <<<${port}>>>`);
  });

bootstrap().catch(console.error);
