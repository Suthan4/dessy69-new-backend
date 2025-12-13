import "dotenv/config";

import { Application } from "./app";
import { startServer } from "dessy69-core-packages";

async function bootstrap() {
  const app = new Application();
  const server = app.getApp();

  startServer(server);
}

bootstrap();
