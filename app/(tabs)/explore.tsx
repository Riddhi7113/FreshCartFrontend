import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Link } from 'expo-router';

interface Board {
  id: string;
  title: string;
  pins: number;
  time: string;
  liked: boolean;
  category: 'All' | 'Me' | 'Shared';
}

const Explore = () => {
  const [boards, setBoards] = useState<Board[]>([
    { id: '1', title: 'Diet', pins: 11, time: '1w', liked: false, category: 'All' },
    { id: '2', title: 'Greens', pins: 9, time: '4w', liked: false, category: 'Me' },
    { id: '3', title: 'Snacks', pins: 5, time: '3mo', liked: false, category: 'Shared' },
    { id: '4', title: 'Party Default', pins: 9, time: '7mo', liked: false, category: 'Shared' },
    { id: '5', title: 'Charcuterie board', pins: 14, time: '11mo', liked: false, category: 'Me' },
    { id: '6', title: 'Thai Food Prep', pins: 6, time: '1y', liked: false, category: 'All' },
    { id: '7', title: 'Grocery', pins: 12, time: '2w', liked: false, category: 'All' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [createListModalVisible, setCreateListModalVisible] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Me' | 'Shared'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const sortBoards = (option: 'A to Z' | 'Reorder' | 'Last saved' | 'Newest' | 'Oldest') => {
    let sortedBoards;
    switch (option) {
      case 'A to Z':
        sortedBoards = [...boards].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'Last saved':
        sortedBoards = [...boards].sort((a, b) => a.time.localeCompare(b.time));
        break;
      case 'Newest':
        sortedBoards = [...boards].reverse();
        break;
      case 'Oldest':
        sortedBoards = [...boards];
        break;
      default:
        return;
    }
    setBoards(sortedBoards);
    setModalVisible(false);
  };

  const deleteBoard = (id: string) => {
    const filteredBoards = boards.filter((board) => board.id !== id);
    setBoards(filteredBoards);
  };

  const renderItem = ({ item, drag, isActive }: { item: Board; drag: () => void; isActive: boolean }) => (
    <View
      style={[styles.board, { backgroundColor: isActive ? '#f0f0f0' : '#ffffff', elevation: 5 }]}
    >
      <View style={styles.boardContent}>
        <Link href={{ pathname: "/list/[id]", params: { id: item.title } }}>
          <Text style={styles.boardTitle}>{item.title}</Text>
        </Link>
        <Text style={styles.subTitle}>{item.time}</Text>
      </View>

      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => deleteBoard(item.id)}>
          <Icon name="trash" size={20} color="red" style={styles.deleteIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const addNewList = () => {
    if (newListName.trim()) {
      const newBoard: Board = {
        id: (boards.length + 1).toString(),
        title: newListName,
        pins: 0,
        time: 'now',
        liked: false,
        category: 'All', // Ensure it’s a valid category: 'All', 'Me', or 'Shared'
      };
      setBoards([...boards, newBoard]);
      setNewListName('');
      setCreateListModalVisible(false);
    }
  };

  const filterBoardsByTab = () => {
    if (activeTab === 'All') return boards.filter(board => board.category === 'All' || board.category === 'Me' || board.category === 'Shared');
    return boards.filter(board => board.category === activeTab);
  };

  const renderTabContent = () => {
    return (
      <ScrollView style={styles.scrollViewContainer}>
        <DraggableFlatList
          data={filterBoardsByTab().filter((board) =>
            board.title.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onDragEnd={({ data }) => setBoards(data)}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={true}
          indicatorStyle="black"
        />
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Explore Boards</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'All' && styles.activeTabButton]}
          onPress={() => setActiveTab('All')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'All' && styles.activeTabButtonText]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Me' && styles.activeTabButton]}
          onPress={() => setActiveTab('Me')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'Me' && styles.activeTabButtonText]}>
            Me
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Shared' && styles.activeTabButton]}
          onPress={() => setActiveTab('Shared')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'Shared' && styles.activeTabButtonText]}>
            Shared
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.utilityContainer}>
        <TouchableOpacity
          style={styles.utilityButton}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="sort" size={20} color="#28a745" />
          <Text style={styles.utilityButtonText}>Sort</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <TouchableOpacity
          style={styles.utilityButton}
          onPress={() => setCreateListModalVisible(true)}
        >
          <Icon name="plus" size={20} color="#28a745" />
        </TouchableOpacity>
      </View>

      {renderTabContent()}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort Options</Text>
            {['A to Z', 'Reorder', 'Last saved', 'Newest', 'Oldest'].map((option) => (
              <Pressable
                key={option}
                style={styles.modalOption}
                onPress={() => sortBoards(option as 'A to Z' | 'Reorder' | 'Last saved' | 'Newest' | 'Oldest')}
              >
                <Text style={styles.modalOptionText}>{option}</Text>
              </Pressable>
            ))}
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={createListModalVisible}
        onRequestClose={() => setCreateListModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New List</Text>
            <TextInput
              style={styles.newListInput}
              placeholder="List Name"
              value={newListName}
              onChangeText={setNewListName}
            />
            <Pressable
              style={styles.createButton}
              onPress={addNewList}
            >
              <Text style={styles.createButtonText}>Create</Text>
            </Pressable>
            <Pressable
              style={styles.closeButton}
              onPress={() => setCreateListModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  activeTabButton: {
    backgroundColor: '#28a745',
  },
  tabButtonText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabButtonText: {
    color: '#fff',
  },
  utilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  utilityButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  utilityButtonText: {
    fontSize: 16,
    color: '#28a745',
    marginLeft: 5,
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 10,
  },
  scrollViewContainer: {
    flex: 1,
  },
  board: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3, // for Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // for iOS shadow
    shadowOpacity: 0.2, // for iOS shadow
    shadowRadius: 2, // for iOS shadow
  },
  boardContent: {
    flexDirection: 'column',
    flex: 1,
  },
  boardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 14,
    color: '#999',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteIcon: {
    padding: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  modalOption: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#28a745',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  newListInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  createButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#28a745',
    borderRadius: 5,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});


export default Explore;
