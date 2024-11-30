import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export function CardView({
  href,
  title,
  price,
  id,
}: {
  href: string;
  title: string;
  price: number;
  id: number;
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lists, setLists] = useState([
    { id: 1, name: 'Groceries', items: [] },
    { id: 2, name: 'Wishlist', items: [] },
    { id: 3, name: 'Office Supplies', items: [] },
  ]);
  const [selectedLists, setSelectedLists] = useState<number[]>([]);
  const [newListName, setNewListName] = useState('');
  const [itemCount, setItemCount] = useState(1);

  const { width } = useWindowDimensions();
  const cardWidth = width / 2 - 24;

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleAddToLists = () => {
    const updatedLists = lists.map((list) => {
      if (selectedLists.includes(list.id)) {
        return {
          ...list,
          items: [...list.items, { id, title, price, count: itemCount }],
        };
      }
      return list;
    });
    setLists(updatedLists);
    setSelectedLists([]);
    setItemCount(1); // Reset count
    toggleModal();
  };

  const handleCreateList = () => {
    if (newListName.trim() === '') {
      alert('List name cannot be empty');
      return;
    }
    const newList = {
      id: lists.length + 1,
      name: newListName.trim(),
      items: [],
    };
    setLists([...lists, newList]);
    setNewListName('');
  };

  const adjustItemCount = (change) => {
    setItemCount((prevCount) => Math.max(1, prevCount + change));
  };

  return (
    <View>
      <View style={[styles.card, { width: cardWidth }]}>
        <Image source={{ uri: href }} style={styles.productImage} />
        <Text style={styles.productTitle}>{title}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.productPrice}>₹{price}</Text>
          <View style={styles.cardActions}>
            <TouchableOpacity onPress={toggleModal}>
              <FontAwesome name="plus-circle" size={24} color="green" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add to List</Text>
            <FlatList
              data={lists}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <Text>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      setSelectedLists((prev) =>
                        prev.includes(item.id)
                          ? prev.filter((id) => id !== item.id)
                          : [...prev, item.id]
                      )
                    }
                  >
                    <FontAwesome
                      name={selectedLists.includes(item.id) ? 'check-square' : 'square-o'}
                      size={24}
                      color="blue"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />

            <View style={styles.newListContainer}>
              <TextInput
                style={styles.newListInput}
                placeholder="New List Name"
                value={newListName}
                onChangeText={setNewListName}
              />
              <TouchableOpacity style={styles.createButton} onPress={handleCreateList}>
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
            </View>

            {/* Item Count Controls */}
            <View style={styles.itemCountContainer}>
              <TouchableOpacity onPress={() => adjustItemCount(-1)}>
                <FontAwesome name="minus-circle" size={30} color="red" />
              </TouchableOpacity>
              <TextInput
                style={styles.itemCountInput}
                keyboardType="number-pad"
                value={itemCount.toString()}
                onChangeText={(text) => setItemCount(Math.max(1, parseInt(text) || 1))}
              />
              <TouchableOpacity onPress={() => adjustItemCount(1)}>
                <FontAwesome name="plus-circle" size={30} color="green" />
              </TouchableOpacity>
            </View>

            <Pressable style={styles.addButton} onPress={handleAddToLists}>
              <Text style={styles.addButtonText}>Add to Selected Lists</Text>
            </Pressable>

            <Pressable style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    alignItems: 'center',
    margin: 8,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    padding: 5,
    marginLeft: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  newListContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  newListInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 10,
  },
  createButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    padding: 10,
  },
  createButtonText: {
    color: '#fff',
  },
  itemCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  itemCountInput: {
    width: 50,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    marginHorizontal: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#6c757d',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
