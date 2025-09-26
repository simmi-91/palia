import dbLinks from "./links.js";
import dbUsers from "./users.js";

// Function to read all databases when the server starts
export async function initializeDatabases() {
  console.log("Reading database files...");

  await dbLinks.read();
  await dbUsers.read();
  console.log("Databases initialized.");
}

// Export the initialized database objects so routes can access them
export { dbLinks, dbUsers };
