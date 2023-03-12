import { Timestamp } from "@google-cloud/firestore";

export class UsersDocument {
  static collectionName = "users";

  id: string;
  created: Timestamp;
  random: any;
}
