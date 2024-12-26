import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import * as T from "fp-ts/Task";
import { getPortFromConfig } from "./services/port-config.service";
import { getDefaultPort } from "../shared";

const bootstrap = async () => {
  const program = pipe(
    getPortFromConfig(),
    TE.fold(
      (error) => {
        console.error(error);
        return T.of(getDefaultPort());
      },
      (port) => T.of(port)
    )
  );

  const port = await program();
  console.log(`Configured port is: <<<${port}>>>`);
};

bootstrap().catch(console.error);
