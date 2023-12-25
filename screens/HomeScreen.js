import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Button,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text
} from "react-native";
import { signOut } from "firebase/auth";
import ItemCard from "../components/ItemCard";
import { auth } from "../config";
import { useAppContext } from "./AppContext";
import { Ionicons } from '@expo/vector-icons'; 


export const HomeScreen = ({ navigation }) => {
  const { products } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
 
  const handleLogout = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };

  const filteredProducts = products.filter((product) =>
    product.itemCategoryName.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
  const aIsLowQuantity = Number(a.currentQty) < Number(a.minQty);
  const bIsLowQuantity = Number(b.currentQty) < Number(b.minQty);

  // Put low quantity products first
  if (aIsLowQuantity && !bIsLowQuantity) {
    return -1;
  } else if (!aIsLowQuantity && bIsLowQuantity) {
    return 1;
  } else {
    // If both are low quantity or both are not, maintain the original order
    return 0;
  }
});

  const hasLowQuantityProduct = filteredProducts.some(
    (product) => Number(product.currentQty) < Number(product.minQty)
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholderTextColor={"#888"}
        placeholder="Search for items..."
        onChangeText={(text) => setSearchQuery(text)}
      />
       {hasLowQuantityProduct && (
        <View style={styles.warningBanner}>
          <Ionicons name="warning" size={24} color="red" />
          <Text style={styles.warningText}>
            Warning: Some products have a low quantity!
          </Text>
        </View>
      )}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.productID.toString()}
        renderItem={({ item }) => (
          // Render your item card here using the details from the 'item' object

          <TouchableOpacity
            onPress={() => navigation.navigate("ItemDetail", { product: item })}
          >
            <ItemCard product={item} />
          </TouchableOpacity>
        )}
      />
      <Button title="Sign Out" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  searchInput: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffe6e6",
    padding: 8,
    marginBottom: 16,
    borderRadius: 8,
  },
  warningText: {
    color: "red",
    fontWeight: "bold",
    marginLeft: 8,
  },
});