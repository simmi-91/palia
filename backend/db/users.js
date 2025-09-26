import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const file = "users.json";
const defaultData = { users: [] };

const adapter = new JSONFile(file);
const dbUsers = new Low(adapter, defaultData);

export default dbUsers;
