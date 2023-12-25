import React, { createContext, useContext, useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const db = getFirestore();
    const productsCollection = collection(db, "products");
    const querySnapshot = await getDocs(productsCollection);

    const productsData = [];
    querySnapshot.forEach((doc) => {
      const product = doc.data();
      productsData.push({ ...product, id: doc.id });
    });

    setProducts(productsData);
  };

  useEffect(() => {
    fetchProducts();
  }, []); // Fetch products on component mount

  const updateProduct = async (productId, updatedData) => {
    // Implement your logic to update the product in Firestore or any other source
    // Example: await updateProductInFirestore(productId, updatedData);
    // Refetch products after the update
    await fetchProducts();
  };

  return (
    <AppContext.Provider value={{ products, updateProduct }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
