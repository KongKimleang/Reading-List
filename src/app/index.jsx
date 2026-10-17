import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { addBook, deleteBook, getBooks, setFinished } from "../services/bookService";

export default function Index() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(true);

  // READ
  const load = useCallback(async () => {
    try {
      setBooks(await getBooks());
    } catch (e) {
      Alert.alert("Error loading books", e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // CREATE
  const onAdd = async () => {
    if (!title.trim() || !author.trim()) {
      Alert.alert("Missing info", "Please enter a title and an author.");
      return;
    }
    try {
      await addBook(title.trim(), author.trim());
      setTitle("");
      setAuthor("");
      load();
    } catch (e) {
      Alert.alert("Error adding book", e.message);
    }
  };

  // UPDATE
  const onToggle = async (book) => {
    try {
      await setFinished(book.$id, !book.finished);
      load();
    } catch (e) {
      Alert.alert("Error updating book", e.message);
    }
  };

  // DELETE
  const onDelete = async (id) => {
    try {
      await deleteBook(id);
      load();
    } catch (e) {
      Alert.alert("Error deleting book", e.message);
    }
  };

  return (
    <SafeAreaView style={s.container}>

      <TextInput
        style={s.input}
        placeholder="Book title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={s.input}
        placeholder="Author"
        value={author}
        onChangeText={setAuthor}
      />
      <TouchableOpacity style={s.addBtn} onPress={onAdd}>
        <Text style={s.addText}>Add Book</Text>
      </TouchableOpacity>

      <FlatList
        data={books}
        keyExtractor={(b) => b.$id}
        ListEmptyComponent={
          <Text style={s.empty}>{loading ? "Loading..." : "No books yet."}</Text>
        }
        renderItem={({ item }) => (
          <View style={s.card}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => onToggle(item)}>
              <Text style={[s.title, item.finished && s.done]}>{item.title}</Text>
              <Text style={s.author}>
                {item.author} · {item.finished ? "✅ Finished" : "📖 Reading"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(item.$id)}>
              <Text style={s.del}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f6f6f9" },
  header: { fontSize: 26, fontWeight: "700", marginBottom: 16 },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  addBtn: {
    backgroundColor: "#4f46e5",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  addText: { color: "#fff", fontWeight: "600" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: { fontSize: 16, fontWeight: "600" },
  done: { textDecorationLine: "line-through", color: "#999" },
  author: { color: "#666", marginTop: 2 },
  del: { fontSize: 20, marginLeft: 12 },
  empty: { textAlign: "center", color: "#888", marginTop: 20 },
});