import "dotenv/config";
import { Application } from "./app";
import { DatabaseConnection } from "./shared/database/DatabaseConnection";
import { startServer } from "@suthan4/core-package";

async function bootstrap() {
  try {
    // Initialize database connection
    const db = DatabaseConnection.getInstance();
    await db.connect(
      "mongodb+srv://mercedessuthan_db_user:lNJuvLuRkEF0BYT7@dev-cluster.hv10uwg.mongodb.net/"
    );
    // Initialize application
    const application = new Application();
    const server = application.getServer();
    startServer(server);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();
