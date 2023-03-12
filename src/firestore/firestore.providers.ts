import { UsersDocument } from "src/users/entities/user.document";

export const FirestoreDatabaseProvider = "firestoredb";
export const FirestoreOptionsProvider = "firestoreOptions";
export const FirestoreCollectionProviders: string[] = [
  UsersDocument.collectionName,
];
