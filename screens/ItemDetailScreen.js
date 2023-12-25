import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  Modal,
  TextInput,
} from "react-native";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { firestore, storage } from "../config/firebase"; // Assuming you have your Firestore instance configured here
import { useAppContext } from "./AppContext";
import { ref, getDownloadURL } from "firebase/storage";

const ItemDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const [isRestockModalVisible, setRestockModalVisible] = useState(false);
  const [restockQuantity, setRestockQuantity] = useState("0");
  const [restockNote, setRestockNote] = useState("");
  const { updateProduct } = useAppContext();
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const loadImageFromStorage = async () => {
      try {
        const storageRef = ref(storage, product.picture);

        const url = await getDownloadURL(storageRef);
        setImageUrl(url);
      } catch (error) {
        console.error("Error loading image from storage:", error);
      }
    };

    loadImageFromStorage();
  }, []);

  const handleRestock = async () => {
    try {
      const productDocRef = doc(firestore, "products", product.id); // Assuming 'productId' is the unique identifier of the product
      const historyCollectionRef = collection(firestore, "history");

      await updateDoc(productDocRef, { currentQty: restockQuantity });
      updateProduct();
      const restockData = {
        productId: product.id,
        quantity: restockQuantity,
        note: restockNote,
        date: serverTimestamp(),
      };

      await addDoc(historyCollectionRef, restockData);
      // Close the modal after restocking
      setRestockModalVisible(false);
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error updating minQty:", error);
      // Handle error as needed
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: imageUrl }} />
      <View style={styles.details}>
        <Text style={styles.name}>{product.itemCategoryName}</Text>
        <Text style={styles.code}>Code: {product.productID}</Text>
        <Text style={styles.category}>
          Category: {product.itemCategoryName}
        </Text>
        <Text style={styles.packSize}>Pack Size: {product.packSize}</Text>
        <Text style={styles.minStockLevel}>
          Current stock: {product.currentQty}
        </Text>
        <Text style={styles.minStockLevel}>
          Min Stock Level: {product.minQty}
        </Text>
        <Text style={styles.unit}>Unit of Measurement: {product.unit}</Text>
        <Text style={styles.location}>Location: {product.location}</Text>
      </View>

        <View style={styles.footer}>
        <Button
          title="Restock"
          onPress={() => setRestockModalVisible(true)}
          color="#4CAF50" // Green color
          style={styles.button}
        />
        <Button
          title="Inventory History"
          onPress={() =>
            navigation.navigate("History", { productId: product.id })
          }
          color="#2196F3" // Blue color
          style={styles.button}
        />
      </View>

      {/* Restock Modal */}
      <Modal
        visible={isRestockModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setRestockModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Restock</Text>
            <View style={styles.quantityInputContainer}>
              <Button
                title="-"
                onPress={() =>
                  setRestockQuantity(
                    Math.max(0, parseInt(restockQuantity) - 1).toString()
                  )
                }
              />

              <TextInput
                style={styles.quantityInput}
                placeholder="Quantity"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={restockQuantity}
                onChangeText={(text) => setRestockQuantity(text)}
              />
              <Button
                title="+"
                onPress={() =>
                  setRestockQuantity((parseInt(restockQuantity) + 1).toString())
                }
              />
            </View>
            <TextInput
              multiline
              numberOfLines={4}
              style={styles.noteInput}
              placeholder="Add a note for the restock (e.g., purchase order number, supplier details)"
              value={restockNote}
              onChangeText={(text) => setRestockNote(text)}
            />
             <View style={styles.footer}>
              <Button
                title="Confirm"
                onPress={handleRestock}
                color="#4CAF50" // Green color
                style={styles.button}
              />
              <Button
                title="Cancel"
                onPress={() => setRestockModalVisible(false)}
                color="#FF5722" // Deep Orange color
                style={styles.button}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff", // White background
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333", // Dark grey color
  },
  code: {
    fontSize: 18,
    marginBottom: 8,
    color: "#555", // Grey color
  },
  category: {
    fontSize: 18,
    marginBottom: 8,
    color: "#555", // Grey color
  },
  packSize: {
    fontSize: 18,
    marginBottom: 8,
    color: "#555", // Grey color
  },
  minStockLevel: {
    fontSize: 18,
    marginBottom: 8,
    // color: "#ff6347", // Tomato color
  },
  unit: {
    fontSize: 18,
    marginBottom: 8,
    color: "#555", // Grey color
  },
  location: {
    fontSize: 18,
    marginBottom: 8,
    color: "#555", // Grey color
  },
  // Styles for the Restock Modal
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    minWidth: 300,
    margin: 20,
    backgroundColor: "#fff", // White background
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333", // Dark grey color
  },
  quantityInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  quantityInput: {
    flex: 1,
    marginHorizontal: 8,
    textAlign: "center",
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#ccc", // Light grey color
    borderRadius: 4,
  },
  noteInput: {
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc", // Light grey color
    borderRadius: 4,
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
 button: {
    backgroundColor: "#2196F3", // Blue color
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    elevation: 2, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});


export default ItemDetailScreen;
