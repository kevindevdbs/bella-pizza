import { AppButton } from "@/components/app-button";
import { AppOrderItem } from "@/components/app-order-item";
import { AppSelect } from "@/components/app-select";
import { borderRadius, colors, fontSize, spacing } from "@/constants/theme";
import api from "@/services/api";
import {
  Category,
  CategoryProductsResponse,
  DetailOrderResponse,
  Items,
  OrderRouteParams,
  Product,
} from "@/types";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

function isTempItemId(itemId: string) {
  return itemId.startsWith("temp-item-");
}

export default function Order() {
  const router = useRouter();
  const params = useLocalSearchParams<OrderRouteParams>();

  const orderId = params.order_id;
  const tableFromParams = params.table;
  const screenMode = params.mode;
  const isSentEditMode = screenMode === "sent";

  const [tableNumber, setTableNumber] = useState<number | null>(
    tableFromParams ? Number(tableFromParams) : null,
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<Items[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);
  const [addingItem, setAddingItem] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState(false);
  const [removingItemId, setRemovingItemId] = useState("");
  const [editingItem, setEditingItem] = useState<Items | null>(null);
  const [itemNoteDraft, setItemNoteDraft] = useState("");
  const [savingItemNote, setSavingItemNote] = useState(false);
  const [applyingSentChanges, setApplyingSentChanges] = useState(false);
  const [pendingNoteUpdates, setPendingNoteUpdates] = useState<
    Record<string, string>
  >({});
  const [pendingRemovedItemIds, setPendingRemovedItemIds] = useState<string[]>(
    [],
  );
  const [pendingAddedItems, setPendingAddedItems] = useState<Items[]>([]);

  const isMutatingItems = addingItem || !!removingItemId || applyingSentChanges;
  const isUpdatingItems = loadingOrderDetails || isMutatingItems;
  const hasPendingSentChanges =
    pendingRemovedItemIds.length > 0 ||
    pendingAddedItems.length > 0 ||
    Object.keys(pendingNoteUpdates).length > 0;

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        label: category.name,
        value: category.id,
      })),
    [categories],
  );

  const productOptions = useMemo(
    () =>
      products.map((product) => ({ label: product.name, value: product.id })),
    [products],
  );

  useEffect(() => {
    if (!orderId) {
      Alert.alert("Erro", "Pedido não encontrado.", [
        {
          text: "Voltar",
          onPress: () => router.replace("/(authenticated)/dashboard"),
        },
      ]);
      return;
    }

    void loadCategories();
    void loadOrderDetails(orderId);
  }, [orderId]);

  async function loadCategories() {
    try {
      setLoadingCategories(true);
      const response = await api.get<Category[]>("/category");
      setCategories(response.data);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível carregar as categorias.");
    } finally {
      setLoadingCategories(false);
    }
  }

  async function loadOrderDetails(orderIdParam: string) {
    try {
      setLoadingOrderDetails(true);
      const response = await api.get<DetailOrderResponse>("/order/detail", {
        params: { order_id: orderIdParam },
      });

      setItems(response.data.items ?? []);
      setPendingNoteUpdates({});
      setPendingRemovedItemIds([]);
      setPendingAddedItems([]);
      if (typeof response.data.table === "number") {
        setTableNumber(response.data.table);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível carregar os itens do pedido.");
    } finally {
      setLoadingOrderDetails(false);
    }
  }

  async function handleSelectCategory(categoryId: string) {
    setSelectedCategory(categoryId);
    setSelectedProduct("");
    setProducts([]);

    if (!categoryId) return;

    try {
      setLoadingProducts(true);
      const response = await api.get<CategoryProductsResponse | Product[]>(
        "/category/products",
        {
          params: { category_id: categoryId },
        },
      );

      const payload = response.data;
      const productsResult = Array.isArray(payload)
        ? payload
        : (payload.result ?? []);

      setProducts(productsResult);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Erro",
        "Não foi possível carregar os produtos da categoria.",
      );
    } finally {
      setLoadingProducts(false);
    }
  }

  async function handleSelectProduct(productId: string) {
    if (!orderId || !productId) return;

    setSelectedProduct(productId);

    if (isSentEditMode) {
      const selectedProductData = products.find(
        (item) => item.id === productId,
      );

      if (!selectedProductData) {
        Alert.alert("Erro", "Produto selecionado não encontrado.");
        return;
      }

      const tempItemId = `temp-item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      const tempItem: Items = {
        id: tempItemId,
        amount: 1,
        note: null,
        product: {
          id: selectedProductData.id,
          name: selectedProductData.name,
          price: selectedProductData.price,
          imageUrl: selectedProductData.imageUrl,
          description: selectedProductData.description,
        },
      };

      setItems((previous) => [...previous, tempItem]);
      setPendingAddedItems((previous) => [...previous, tempItem]);
      setSelectedProduct("");
      return;
    }

    try {
      setAddingItem(true);
      await api.post("/order/add", {
        order_id: orderId,
        product_id: productId,
        amount: 1,
      });

      await loadOrderDetails(orderId);
      setSelectedProduct("");
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível adicionar o item no pedido.");
    } finally {
      setAddingItem(false);
    }
  }

  async function handleRemoveItem(itemId: string) {
    if (!orderId) return;

    if (isSentEditMode) {
      const removedItem = items.find((item) => item.id === itemId);
      if (!removedItem) {
        return;
      }

      setItems((previous) => previous.filter((item) => item.id !== itemId));

      if (isTempItemId(itemId)) {
        setPendingAddedItems((previous) =>
          previous.filter((item) => item.id !== itemId),
        );
      } else {
        setPendingRemovedItemIds((previous) => {
          if (previous.includes(itemId)) {
            return previous;
          }

          return [...previous, itemId];
        });
      }

      setPendingNoteUpdates((previous) => {
        if (!(itemId in previous)) {
          return previous;
        }

        const next = { ...previous };
        delete next[itemId];
        return next;
      });

      return;
    }

    try {
      setRemovingItemId(itemId);
      await api.delete("/order/remove", {
        params: { item_id: itemId },
      });

      await loadOrderDetails(orderId);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível remover o item.");
    } finally {
      setRemovingItemId("");
    }
  }

  function handleDeleteOrder() {
    if (!orderId || deletingOrder) return;

    const title = isSentEditMode ? "Cancelar pedido" : "Excluir pedido";
    const description = isSentEditMode
      ? "Deseja realmente cancelar este pedido enviado para a cozinha?"
      : "Deseja realmente excluir este pedido?";
    const confirmLabel = isSentEditMode ? "Cancelar pedido" : "Excluir";

    Alert.alert(title, description, [
      { text: "Cancelar", style: "cancel" },
      {
        text: confirmLabel,
        style: "destructive",
        onPress: async () => {
          try {
            setDeletingOrder(true);
            await api.delete("/order", {
              params: { order_id: orderId },
            });

            router.replace("/(authenticated)/dashboard");
          } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível cancelar o pedido.");
          } finally {
            setDeletingOrder(false);
          }
        },
      },
    ]);
  }

  function handleGoToSendOrder() {
    if (isSentEditMode) {
      return;
    }

    if (!orderId) return;

    router.push({
      pathname: "/(authenticated)/send-order",
      params: {
        order_id: orderId,
        table: String(tableNumber ?? ""),
      },
    });
  }

  function handleOpenNoteEditor(item: Items) {
    setEditingItem(item);
    setItemNoteDraft(item.note ?? "");
  }

  async function handleSaveItemNote() {
    if (!editingItem?.id || !orderId) {
      return;
    }

    if (isSentEditMode) {
      const normalizedNote = itemNoteDraft.trim();

      setItems((previous) =>
        previous.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                note: normalizedNote || null,
              }
            : item,
        ),
      );

      if (isTempItemId(editingItem.id)) {
        setPendingAddedItems((previous) =>
          previous.map((item) =>
            item.id === editingItem.id
              ? {
                  ...item,
                  note: normalizedNote || null,
                }
              : item,
          ),
        );
      } else {
        setPendingNoteUpdates((previous) => ({
          ...previous,
          [editingItem.id]: normalizedNote,
        }));
      }

      setEditingItem(null);
      setItemNoteDraft("");
      return;
    }

    try {
      setSavingItemNote(true);
      await api.put("/order/item", {
        item_id: editingItem.id,
        note: itemNoteDraft.trim(),
      });

      await loadOrderDetails(orderId);
      setEditingItem(null);
      setItemNoteDraft("");
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível atualizar a observação do item.");
    } finally {
      setSavingItemNote(false);
    }
  }

  function handleCloseNoteEditor() {
    if (savingItemNote) {
      return;
    }

    setEditingItem(null);
    setItemNoteDraft("");
  }

  async function handleApplySentChanges() {
    if (!orderId || applyingSentChanges) {
      return;
    }

    if (!hasPendingSentChanges) {
      router.replace("/(authenticated)/dashboard");
      return;
    }

    try {
      setApplyingSentChanges(true);

      for (const itemId of pendingRemovedItemIds) {
        await api.delete("/order/remove", {
          params: { item_id: itemId },
        });
      }

      for (const item of pendingAddedItems) {
        await api.post("/order/add", {
          order_id: orderId,
          product_id: item.product.id,
          amount: item.amount,
          note: item.note?.trim() || undefined,
        });
      }

      const pendingNoteEntries = Object.entries(pendingNoteUpdates).filter(
        ([itemId]) =>
          !isTempItemId(itemId) && !pendingRemovedItemIds.includes(itemId),
      );

      for (const [itemId, note] of pendingNoteEntries) {
        await api.put("/order/item", {
          item_id: itemId,
          note,
        });
      }

      Alert.alert("Sucesso", "Alterações enviadas para a cozinha.");
      router.replace("/(authenticated)/dashboard");
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Erro",
        "Não foi possível concluir as alterações. Tente novamente.",
      );
    } finally {
      setApplyingSentChanges(false);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.topBar}>
            <Text style={styles.tableTitle}>Mesa {tableNumber ?? "--"}</Text>

            {isSentEditMode ? (
              <Pressable
                style={[
                  styles.deleteOrderButton,
                  deletingOrder && styles.buttonDisabled,
                ]}
                onPress={handleDeleteOrder}
                disabled={deletingOrder}
              >
                <Feather
                  name="trash-2"
                  size={16}
                  color={colors.primaryForeground}
                />
              </Pressable>
            ) : null}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Categorias</Text>

            <AppSelect
              value={selectedCategory}
              options={categoryOptions}
              onValueChange={handleSelectCategory}
              placeholder={
                loadingCategories
                  ? "Carregando categorias..."
                  : "Selecione a categoria"
              }
              disabled={loadingCategories}
            />

            {loadingCategories ? (
              <View style={styles.skeletonGroup}>
                <View style={[styles.skeletonLine, styles.skeletonLineLarge]} />
              </View>
            ) : null}

            {selectedCategory ? (
              <AppSelect
                value={selectedProduct}
                options={productOptions}
                onValueChange={handleSelectProduct}
                placeholder={
                  loadingProducts
                    ? "Carregando produtos..."
                    : addingItem
                      ? "Adicionando item..."
                      : "Selecione o produto"
                }
                disabled={
                  loadingProducts || addingItem || productOptions.length === 0
                }
                containerStyle={styles.productsSelect}
              />
            ) : null}

            {loadingProducts ? (
              <View style={styles.skeletonGroup}>
                <View style={[styles.skeletonLine, styles.skeletonLineLarge]} />
              </View>
            ) : null}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>
              {isSentEditMode ? "Itens para alterar" : "Itens adicionados"}
            </Text>

            {isMutatingItems ? (
              <View style={styles.skeletonGroup}>
                <View
                  style={[styles.skeletonLine, styles.skeletonLineMedium]}
                />
              </View>
            ) : null}

            {loadingOrderDetails ? (
              <View style={styles.skeletonItemsList}>
                <View style={styles.skeletonItemCard} />
                <View style={styles.skeletonItemCard} />
              </View>
            ) : items.length === 0 ? (
              <Text style={styles.emptyText}>
                Nenhum item adicionado ainda.
              </Text>
            ) : (
              <View style={styles.itemsList}>
                {items.map((item) => (
                  <AppOrderItem
                    key={item.id}
                    name={item.product.name}
                    quantity={item.amount}
                    price={item.product.price / 100}
                    note={item.note}
                    onEditNote={() => handleOpenNoteEditor(item)}
                    onRemove={() => handleRemoveItem(item.id)}
                    removing={removingItemId === item.id}
                  />
                ))}
              </View>
            )}
          </View>

          <View style={styles.footer}>
            {isSentEditMode ? (
              <AppButton
                title={
                  applyingSentChanges
                    ? "Enviando alterações..."
                    : "Concluir alterações"
                }
                onPress={handleApplySentChanges}
                loading={applyingSentChanges}
              />
            ) : (
              <AppButton
                title="Avançar"
                onPress={handleGoToSendOrder}
                disabled={isUpdatingItems || items.length === 0}
              />
            )}
          </View>
        </ScrollView>

        <Modal
          transparent
          animationType="fade"
          visible={editingItem !== null}
          onRequestClose={handleCloseNoteEditor}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Editar observação do item</Text>

              <Text style={styles.modalSubtitle} numberOfLines={2}>
                {editingItem?.product.name}
              </Text>

              <TextInput
                style={styles.modalInput}
                placeholder="Ex: sem cebola, retirar azeitona"
                placeholderTextColor={colors.mutedText}
                value={itemNoteDraft}
                onChangeText={setItemNoteDraft}
                multiline
                maxLength={220}
                editable={!savingItemNote}
              />

              <View style={styles.modalActions}>
                <AppButton
                  title="Cancelar"
                  onPress={handleCloseNoteEditor}
                  disabled={savingItemNote}
                  buttonStyle={styles.modalButton}
                />
                <AppButton
                  title={savingItemNote ? "Salvando..." : "Salvar"}
                  variant="primary"
                  onPress={handleSaveItemNote}
                  disabled={savingItemNote}
                  buttonStyle={styles.modalButton}
                />
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  tableTitle: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: "700",
  },
  deleteOrderButton: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  productsSelect: {
    marginTop: spacing.sm,
  },
  skeletonGroup: {
    marginTop: spacing.sm,
  },
  skeletonLine: {
    height: 12,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.muted,
  },
  skeletonLineLarge: {
    width: "72%",
  },
  skeletonLineMedium: {
    width: "58%",
  },
  skeletonItemsList: {
    gap: spacing.sm,
  },
  skeletonItemCard: {
    height: 72,
    borderRadius: borderRadius.md,
    backgroundColor: colors.muted,
  },
  itemsList: {
    gap: spacing.sm,
  },
  emptyText: {
    color: colors.mutedText,
    fontSize: fontSize.md,
  },
  footer: {
    marginTop: "auto",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  modalCard: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.card,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  modalTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: "700",
  },
  modalSubtitle: {
    color: colors.mutedText,
    fontSize: fontSize.md,
  },
  modalInput: {
    minHeight: 110,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text,
    backgroundColor: colors.background,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  modalButton: {
    flex: 1,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
