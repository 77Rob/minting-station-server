import { Timestamp } from "@google-cloud/firestore";

type Collection = {
  name?: string;
  address?: string;
  deployed?: boolean;
  external_link?: string;
  description?: string;
};

export class UsersDocument {
  static collectionName = "users";
  deployedCollections?: string[];
  image?: Collection;
}
