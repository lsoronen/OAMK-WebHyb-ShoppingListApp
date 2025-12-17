import { StatusBar } from 'expo-status-bar';
import { Button, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useEffect, useState } from 'react';
import {
  firestore,
  collection,
  addDoc,
  serverTimestamp,
  LISTITEMS,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc
} from './firebase/Config';
import { SafeAreaView } from 'react-native-safe-area-context';


type ListItem = {
  id: string;
  text: string;
  done: boolean;
};

export default function App() {
  const [newItem, setNewItem] = useState<string>('')
  const [items, setItems] = useState<ListItem[]>([])

  useEffect(() => {
    const colRef = collection(firestore, LISTITEMS);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const rows: ListItem[] = snap.docs.map(d => ({
        id: d.id,
        text: d.data().text ?? '',
        done: d.data().done ?? false,
      }));
      setItems(rows);
    }, (err) => {
      console.error('onSnapshot error', err);
    });
    return () => { unsubscribe() };
  }, []);


  async function handleAdd(): Promise<void> {
    if (!newItem.trim()) return;
    try {
      const colRef = collection(firestore, LISTITEMS);
      await addDoc(colRef, {
        text: newItem.trim(),
        done: false,
        createdAt: serverTimestamp(),
      });
      setNewItem('');
    } catch (err) {
      console.error('Failed to add item', err);
    }
  }

  async function handleDelete(id: string): Promise<void> {
    try {
      const docRef = doc(firestore, LISTITEMS, id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error('Failed to delete item', err);
    }
  }

  async function handleToggleDone(item: ListItem): Promise<void> {
    try {
      const docRef = doc(firestore, LISTITEMS, item.id);
      await updateDoc(docRef, {
        done: !item.done,
      });
    } catch (err) {
      console.error('Failed to toggle done', err);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Shopping list</Text>
        <View style={styles.addRow}>
          <TextInput
            style={styles.input}
            placeholder='Type here...'
            value={newItem}
            onChangeText={setNewItem}
          />
          <Button
            title='Add'
            onPress={handleAdd}
          />
        </View>

        <ScrollView
          style={{ width: '100%', marginTop: 8 }}
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          {items.map((item, id) => (
            <View key={item.id} style={styles.itemRow}>
              <Pressable
                style={{ flex: 1 }}
                onPress={() => handleToggleDone(item)}
              >
                <Text
                  style={[
                    styles.itemText,
                    item.done && styles.itemDone,
                  ]}
                >
                  {item.text}
                </Text>
              </Pressable>
              <Button
                title="X"
                color="#d32f2f"
                onPress={() => handleDelete(item.id)}
              />
            </View>
          ))}
        </ScrollView>

        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  addRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 8,
    marginRight: 8,
    height: 40,
    borderRadius: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 4,
  },
  itemInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 8,
    marginRight: 8,
    height: 36,
    borderRadius: 4,
  },
  itemText: {
    fontSize: 16,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: '#f9f9f9'
  },
  itemDone: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
});
