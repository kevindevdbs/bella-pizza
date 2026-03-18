import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import api from "../services/api";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  categoryId: string;
  disabled: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface ProductSelectorProps {
  orderId: string;
  onProductAdded?: () => void;
  onClose?: () => void;
}

export function ProductSelector({
  orderId,
  onProductAdded,
  onClose,
}: ProductSelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);

  // Carregar categorias e produtos ao montar o componente
  React.useEffect(() => {
    loadData();
  }, []);

  // Filtrar produtos baseado na categoria selecionada
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filtrar por categoria
    if (selectedCategoryId) {
      filtered = filtered.filter((p) => p.categoryId === selectedCategoryId);
    }

    return filtered;
  }, [products, selectedCategoryId]);

  async function loadData() {
    try {
      setLoading(true);

      // Carregar categorias
      const categoriesResponse = await api.get("/category");
      setCategories(categoriesResponse.data || []);

      // Carregar todos os produtos
      const productsResponse = await api.get("/products");
      setProducts(productsResponse.data || []);

      // Selecionar primeira categoria por padrão
      if (categoriesResponse.data && categoriesResponse.data.length > 0) {
        setSelectedCategoryId(categoriesResponse.data[0].id);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      Alert.alert("Erro", "Não foi possível carregar os produtos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function addProductToOrder(productId: string) {
    try {
      setAddingProductId(productId);

      const response = await api.post("/order/add", {
        order_id: orderId,
        product_id: productId,
        amount: 1,
      });

      if (response.status === 200 || response.status === 201) {
        const product = products.find((p) => p.id === productId);
        Alert.alert("Sucesso", `${product?.name} adicionado ao pedido!`);

        if (onProductAdded) {
          onProductAdded();
        }
      }
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      Alert.alert("Erro", "Não foi possível adicionar o produto. Tente novamente.");
    } finally {
      setAddingProductId(null);
    }
  }

  function formatPrice(centavos: number): string {
    if (!centavos || isNaN(centavos)) {
      return "R$ 0,00";
    }
    return `R$ ${(centavos / 100).toFixed(2).replace(".", ",")}`;
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E63946" />
        <Text style={styles.loadingText}>Carregando produtos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header com título */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Selecionar Produto</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Grid de produtos com categorias como cabeçalho */}
      {filteredProducts.length > 0 ? (
        <FlatList
          ListHeaderComponent={
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesContainer}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryTab,
                    selectedCategoryId === category.id && styles.categoryTabActive,
                  ]}
                  onPress={() => setSelectedCategoryId(category.id)}
                >
                  <Text
                    style={[
                      styles.categoryTabText,
                      selectedCategoryId === category.id && styles.categoryTabTextActive,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          }
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productCard}
              onPress={() => addProductToOrder(item.id)}
              disabled={addingProductId === item.id}
              activeOpacity={0.7}
            >
              {/* Imagem do produto */}
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.productImage}
              />

              {/* Conteúdo do card */}
              <View style={styles.productContent}>
                <Text style={styles.productName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.productDescription} numberOfLines={1}>
                  {item.description}
                </Text>
                <View style={styles.productFooter}>
                  <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
                  {addingProductId === item.id ? (
                    <ActivityIndicator size="small" color="#E63946" />
                  ) : (
                    <Text style={styles.addButtonText}>+</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    backgroundColor: "#E63946",
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#FFF",
  },
  categoriesContainer: {
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
  },
  categoryTabActive: {
    backgroundColor: "#E63946",
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  categoryTabTextActive: {
    color: "#FFF",
  },
  grid: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  productCard: {
    flex: 1,
    marginHorizontal: 4,
    marginVertical: 6,
    backgroundColor: "#FFF",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productImage: {
    width: "100%",
    height: 120,
    backgroundColor: "#F0F0F0",
  },
  productContent: {
    padding: 8,
  },
  productName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 10,
    color: "#999",
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  productPrice: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#E63946",
    flex: 1,
  },
  addButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E63946",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
});
