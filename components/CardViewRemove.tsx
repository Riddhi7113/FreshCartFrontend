import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, FlatList, TextInput, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // For the back arrow icon
import { Link } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

export function CardView({
  href,
  title,
  price,
  id,
  onDelete,
}: {
  href: string;
  title: string;
  price: number;
  id: number;
  onDelete: (id: number) => void;
}) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: href }} style={styles.productImage} />
      <Text>{title}</Text>
      <View style={styles.cardFooter}>
        <Text>₹{price.toFixed(2)}</Text>
        <TouchableOpacity onPress={() => onDelete(id)}>
          <Ionicons name="remove-circle" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ExplorePage() {
  const [groceries, setGroceries] = useState<any[]>([]); // Use sample data directly
  const [loading, setLoading] = useState(false); // Set loading to false as we're not fetching data anymore
  const [budget, setBudget] = useState(0); // State for budget input
  const { id } = useLocalSearchParams<{ id: string }>();

  // Sample data to represent grocery items
  const sampleGroceries = [
    { id: 1, name: 'Apple', price: 1.99, imageUrl: 'https://example.com/apple.jpg', categoryId: '1' },
    { id: 2, name: 'Banana', price: 0.99, imageUrl: 'https://example.com/banana.jpg', categoryId: '1' },
    { id: 3, name: 'Carrot', price: 2.49, imageUrl: 'https://example.com/carrot.jpg', categoryId: '1' },
    { id: 4, name: 'Milk', price: 1.49, imageUrl: 'https://example.com/milk.jpg', categoryId: '1' },
    { id: 5, name: 'Eggs', price: 3.99, imageUrl: 'https://example.com/eggs.jpg', categoryId: '1' },
    { id: 6, name: 'Bread', price: 2.79, imageUrl: 'https://example.com/bread.jpg', categoryId: '1' },
    { id: 7, name: 'Orange', price: 1.29, imageUrl: 'https://example.com/orange.jpg', categoryId: '2' },
    { id: 8, name: 'Strawberries', price: 4.99, imageUrl: 'https://example.com/strawberries.jpg', categoryId: '2' },
    { id: 9, name: 'Yogurt', price: 2.99, imageUrl: 'https://example.com/yogurt.jpg', categoryId: '2' },
    { id: 10, name: 'Cheese', price: 5.49, imageUrl: 'https://example.com/cheese.jpg', categoryId: '2' },
    { id: 11, name: 'Chicken', price: 7.99, imageUrl: 'https://example.com/chicken.jpg', categoryId: '3' },
    { id: 12, name: 'Fish', price: 8.99, imageUrl: 'https://example.com/fish.jpg', categoryId: '3' },
    { id: 13, name: 'Rice', price: 1.49, imageUrl: 'https://example.com/rice.jpg', categoryId: '3' },
    { id: 14, name: 'Pasta', price: 1.99, imageUrl: 'https://example.com/pasta.jpg', categoryId: '3' },
    { id: 15, name: 'Tomatoes', price: 0.99, imageUrl: 'https://example.com/tomatoes.jpg', categoryId: '4' },
    { id: 16, name: 'Potatoes', price: 1.29, imageUrl: 'https://example.com/potatoes.jpg', categoryId: '4' },
    { id: 17, name: 'Lettuce', price: 1.79, imageUrl: 'https://example.com/lettuce.jpg', categoryId: '4' },
    { id: 18, name: 'Onions', price: 0.79, imageUrl: 'https://example.com/onions.jpg', categoryId: '4' },
    { id: 19, name: 'Peanut Butter', price: 3.49, imageUrl: 'https://example.com/peanut-butter.jpg', categoryId: '5' },
    { id: 20, name: 'Jam', price: 2.99, imageUrl: 'https://example.com/jam.jpg', categoryId: '5' },
  ];

  // Set groceries on mount
  useEffect(() => {
    setGroceries(sampleGroceries); // Directly set sample data
  }, []);

  // Handle deleting an item
  const handleDelete = (id: number) => {
    setGroceries((prevGroceries) => prevGroceries.filter((item) => item.id !== id));
  };

  // Loading and empty state handling
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading groceries...</Text>
      </SafeAreaView>
    );
  }

  if (groceries.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No groceries found.</Text>
      </SafeAreaView>
    );
  }

  // Get category name based on the `id`
  const categoryName = groceries.length > 0 ? `${id}` : 'Groceries';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      {/* Header with back arrow */}
      <View style={styles.header}>
        <Link href="/(tabs)/explore" style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#6c757d" />
        </Link>
        <Text style={styles.title}>{categoryName}</Text>
      </View>

      {/* Budget input bar */}
      <View style={styles.budgetBar}>
        <Text style={styles.budgetLabel}>Budget:</Text>
        <TextInput
          style={styles.budgetInput}
          placeholder="Enter budget"
          keyboardType="numeric"
          value={budget.toString()}
          onChangeText={(value) => setBudget(Number(value))}
        />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Display the groceries using FlatList */}
        <FlatList
          data={groceries}
          keyExtractor={(item) => item.id.toString()} // Assuming each item has a unique `id`
          numColumns={2} // Ensures 2 items per row
          renderItem={({ item }) => (
            <View
              style={[
                styles.cardWrapper,
                item.price > budget && budget > 0 ? styles.exceedingBudget : {},
              ]}
            >
              <CardView
                href={item.imageUrl} // Assuming `imageUrl` is the key for the image
                title={item.name}
                price={item.price}
                id={item.id}
                onDelete={handleDelete}
              />
            </View>
          )}
          contentContainerStyle={styles.flatListContainer} // Flex-wrap applied here
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row', // Make sure back button and title are in a row
    alignItems: 'center',
    width: '100%',
    paddingBottom: 10,
    paddingTop: 16,
    backgroundColor: '#ffffff',
  },
  backButton: {
    padding: 10, // Adjust padding as needed
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
    flex: 1, // Make sure the title is aligned properly
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  budgetBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  budgetLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495057',
    marginRight: 8,
  },
  budgetInput: {
    flex: 1,
    height: 40,
    borderColor: '#ced4da',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 4,
  },
  flatListContainer: {
    padding: 10,
    justifyContent: 'space-between',
  },
  cardWrapper: {
    flex: 1,
    margin: 8,
    maxWidth: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  card: {
    padding: 10,
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  exceedingBudget: {
    backgroundColor: '#f8d7da',
  },
});
