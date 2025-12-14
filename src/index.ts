import "dotenv/config";

import { Application } from "./app";
import { startServer } from "dessy69-core-packages";
import { DatabaseConnection } from "./infrastructure/database/DatabaseConnection";

async function bootstrap() {
  const app = new Application();
  const server = app.getApp();
  const db = DatabaseConnection.getInstance();
  await db.connect(
    "mongodb+srv://mercedessuthan_db_user:lNJuvLuRkEF0BYT7@dev-cluster.hv10uwg.mongodb.net/"
  );
  startServer(server);
}

bootstrap();
