import { Client, Databases } from "react-native-appwrite";
import "react-native-url-polyfill/auto";

const booksCollectionId =
  process.env.EXPO_PUBLIC_APPWRITE_COL_BOOKS_ID ||
  process.env.EXPO_PUBLIC_APPWRITE_COL_NOTES_ID;

if (!booksCollectionId) {
  throw new Error(
    "Missing Appwrite collection ID. Set EXPO_PUBLIC_APPWRITE_COL_BOOKS_ID in your environment.",
  );
}

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID);
  // .setPlatform("host.exp.exponent"); // uncomment only if testing in Expo Go

export const databases = new Databases(client);

export const config = {
  db: process.env.EXPO_PUBLIC_APPWRITE_DB_ID,
  col: {
    books: booksCollectionId,
  },
};