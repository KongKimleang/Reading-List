import { ID, Query } from "react-native-appwrite";
import { config, databases } from "./appwriteConfig";

// READ
export const getBooks = async () => {
  try {
    const res = await databases.listDocuments(config.db, config.col.books, [
      Query.orderDesc("$createdAt"),
    ]);
    return res.documents;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

// CREATE
export const addBook = async (title, author) => {
  try {
    return await databases.createDocument(config.db, config.col.books, ID.unique(), {
      title,
      author,
      finished: false,
    });
  } catch (error) {
    console.error("Error adding book:", error);
    throw error;
  }
};

// UPDATE
export const setFinished = async (id, finished) => {
  try {
    return await databases.updateDocument(config.db, config.col.books, id, { finished });
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
};

// DELETE
export const deleteBook = async (id) => {
  try {
    await databases.deleteDocument(config.db, config.col.books, id);
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
};