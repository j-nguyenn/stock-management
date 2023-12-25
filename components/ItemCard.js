import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons'; 

const ItemCard = ({ product }) => {
  return (
    <View style={styles.card}>
      {/* Assuming 'picture' is a field in your Firestore document */}
     
      <View style={styles.details}>
        {Number(product.currentQty) < Number(product.minQty) && (
          <View style={styles.warningBanner}>
            <Ionicons name="warning" size={24} color="red" />
            <Text style={styles.warningText}>Low Quantity!</Text>
          </View>
        )}

        <Text style={styles.name}>{product.itemCategoryName}</Text>
        <Text style={styles.code}>Code: {product.productID}</Text>
        <Text style={styles.category}>
          Category: {product.itemCategoryName}
        </Text>
        <Text style={styles.packSize}>
          Description: {product.productDescription}
        </Text>
        {Number(product.currentQty) < Number(product.minQty) ? <Text style={styles.minStockLevel}>
          Current Stock Level: {product.currentQty} (min: {product.minQty})
        </Text> :
        <Text style={styles.category}>
          Current Stock Level: {product.currentQty}
        </Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#fff",
    elevation: 2, // for Android shadow
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 16,
    borderRadius: 4,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  code: {
    fontSize: 16,
    marginBottom: 4,
    color: "#555",
  },
  category: {
    fontSize: 16,
    marginBottom: 4,
    color: "#555",
  },
  description: {
    fontSize: 14,
    marginBottom: 4,
    color: "#777",
  },
  minStockLevel: {
    fontSize: 16,
    marginBottom: 4,
    color: "#ff6347", // Tomato color
  },
  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    marginTop: 8,
    backgroundColor: "#ffd4d4", // Light red background
    borderRadius: 4,
  },
  warningText: {
    color: "#ff6347", // Tomato color
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default ItemCard;
