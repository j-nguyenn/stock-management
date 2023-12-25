import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../config/firebase";
import { Ionicons } from '@expo/vector-icons'; 

const HistoryScreen = ({ route }) => {
  const { productId } = route.params;
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const historyCollectionRef = collection(firestore, "history");
        const q = query(historyCollectionRef, where("productId", "==", productId));
        const querySnapshot = await getDocs(q);

        const historyData = [];
        querySnapshot.forEach((doc) => {
          historyData.push({ id: doc.id, ...doc.data() });
        });

        setHistory(historyData);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, [productId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory Update</Text>
      {history.length === 0 ? (
        <Text style={styles.noHistoryText}>No Inventory Update available.</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="ios-calendar" size={24} color="#000" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.quantityText}>{`Quantity: ${item.quantity}`}</Text>
                <Text style={styles.noteText}>{`Note: ${item.note}`}</Text>
                <Text style={styles.dateText}>{`Date: ${item.date.toDate().toLocaleString()}`}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  noHistoryText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  iconContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  quantityText: {
    fontSize: 16,
    marginBottom: 4,
  },
  noteText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: "#888",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 16,
  },
});

export default HistoryScreen;
