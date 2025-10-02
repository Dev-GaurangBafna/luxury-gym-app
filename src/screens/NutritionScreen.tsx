import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  UtensilsCrossed, 
  Camera, 
  Search, 
  Plus, 
  X,
  Clock,
  Utensils,
  Coffee,
  Apple,
  ChefHat
} from 'lucide-react-native';

import { Colors, Typography, Spacing, Layout, BorderRadius } from '../constants/theme';
import { GlassCard } from '../components/ui/GlassCard';
import { LuxuryButton } from '../components/ui/LuxuryButton';
import { BarcodeScanner } from '../components/BarcodeScanner';
import { openFoodFactsService } from '../services/openFoodFacts';
import { databaseService } from '../services/database';
import { Food, FoodEntry, MacroNutrients } from '../types';

interface MealData {
  name: string;
  icon: React.ReactNode;
  entries: FoodEntry[];
  totalCalories: number;
}

export const NutritionScreen: React.FC = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [showAddFood, setShowAddFood] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [todayEntries, setTodayEntries] = useState<FoodEntry[]>([]);
  const [dailyTotals, setDailyTotals] = useState<MacroNutrients>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  const targetCalories = 2200;
  const targetProtein = 180;
  const targetCarbs = 275;
  const targetFat = 75;

  useEffect(() => {
    loadTodayEntries();
  }, []);

  useEffect(() => {
    calculateDailyTotals();
  }, [todayEntries]);

  const loadTodayEntries = async () => {
    try {
      const today = new Date();
      const entries = await databaseService.getFoodEntriesByDate('user-1', today);
      setTodayEntries(entries);
    } catch (error) {
      console.error('Error loading food entries:', error);
    }
  };

  const calculateDailyTotals = () => {
    const totals = todayEntries.reduce(
      (acc, entry) => {
        const multiplier = entry.quantity;
        return {
          calories: acc.calories + (entry.food.calories * multiplier),
          protein: acc.protein + (entry.food.protein * multiplier),
          carbs: acc.carbs + (entry.food.carbs * multiplier),
          fat: acc.fat + (entry.food.fat * multiplier),
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
    setDailyTotals(totals);
  };

  const getMealData = (): MealData[] => {
    const meals = [
      { name: 'Breakfast', key: 'breakfast' as const, icon: <Coffee size={20} color={Colors.gold} /> },
      { name: 'Lunch', key: 'lunch' as const, icon: <Utensils size={20} color={Colors.gold} /> },
      { name: 'Dinner', key: 'dinner' as const, icon: <ChefHat size={20} color={Colors.gold} /> },
      { name: 'Snacks', key: 'snack' as const, icon: <Apple size={20} color={Colors.gold} /> },
    ];

    return meals.map(meal => {
      const entries = todayEntries.filter(entry => entry.meal === meal.key);
      const totalCalories = entries.reduce((sum, entry) => 
        sum + (entry.food.calories * entry.quantity), 0
      );
      
      return {
        name: meal.name,
        icon: meal.icon,
        entries,
        totalCalories,
      };
    });
  };

  const handleBarcodeScanned = async (barcode: string) => {
    setShowScanner(false);
    
    try {
      // First check local database
      let food = await databaseService.getFoodByBarcode(barcode);
      
      if (!food) {
        // If not found locally, fetch from OpenFoodFacts
        food = await openFoodFactsService.getProductByBarcode(barcode);
        
        if (food) {
          // Save to local database for future use
          await databaseService.createFood(food);
        }
      }
      
      if (food) {
        setSelectedFood(food);
        setShowAddFood(true);
      } else {
        Alert.alert(
          'Product Not Found',
          'We couldn\'t find nutritional information for this barcode. Try searching manually or scan a different product.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error processing barcode:', error);
      Alert.alert('Error', 'Failed to process barcode. Please try again.');
    }
  };

  const handleFoodSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Search local database first
      const localResults = await databaseService.searchFoods(query, 10);
      
      // Search OpenFoodFacts for more results
      const remoteResults = await openFoodFactsService.searchProducts(query, 1, 10);
      
      // Combine and deduplicate results
      const allResults = [...localResults, ...remoteResults];
      const uniqueResults = allResults.filter((food, index, self) => 
        index === self.findIndex(f => f.name === food.name && f.brand === food.brand)
      );
      
      setSearchResults(uniqueResults.slice(0, 20));
    } catch (error) {
      console.error('Error searching foods:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddFood = async () => {
    if (!selectedFood) return;

    try {
      const entry: Omit<FoodEntry, 'createdAt' | 'food'> = {
        id: `entry_${Date.now()}`,
        userId: 'user-1',
        foodId: selectedFood.id,
        quantity: parseFloat(quantity) || 1,
        meal: selectedMeal,
        loggedAt: new Date(),
      };

      await databaseService.createFoodEntry(entry);
      await loadTodayEntries();
      
      setShowAddFood(false);
      setSelectedFood(null);
      setQuantity('1');
    } catch (error) {
      console.error('Error adding food entry:', error);
      Alert.alert('Error', 'Failed to add food entry. Please try again.');
    }
  };

  const openFoodSearch = (meal: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    setSelectedMeal(meal);
    setShowFoodSearch(true);
  };

  const mealData = getMealData();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Nutrition</Text>
          <Text style={styles.subtitle}>Fuel your performance</Text>
        </View>

        {/* Quick Actions */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Quick Add</Text>
          <View style={styles.quickActions}>
            <LuxuryButton
              title="Scan Barcode"
              variant="gold"
              size="small"
              onPress={() => setShowScanner(true)}
              style={styles.actionButton}
              icon={<Camera size={18} color={Colors.background} />}
            />
            <LuxuryButton
              title="Search Food"
              variant="outline"
              size="small"
              onPress={() => setShowFoodSearch(true)}
              style={styles.actionButton}
              icon={<Search size={18} color={Colors.gold} />}
            />
          </View>
        </GlassCard>

        {/* Daily Summary */}
        <GlassCard style={styles.card} withGoldBorder>
          <View style={styles.cardHeader}>
            <UtensilsCrossed size={28} color={Colors.gold} />
            <Text style={styles.cardTitle}>Today's Intake</Text>
          </View>
          
          <View style={styles.caloriesSummary}>
            <Text style={styles.caloriesNumber}>{Math.round(dailyTotals.calories)}</Text>
            <Text style={styles.caloriesLabel}>calories consumed</Text>
            <Text style={[
              styles.caloriesRemaining,
              { color: dailyTotals.calories > targetCalories ? Colors.crimson : Colors.emerald }
            ]}>
              {Math.abs(targetCalories - dailyTotals.calories)} {dailyTotals.calories > targetCalories ? 'over' : 'remaining'}
            </Text>
          </View>

          <View style={styles.macroSummary}>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{Math.round(dailyTotals.protein)}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
              <View style={styles.macroBarContainer}>
                <LinearGradient
                  colors={[Colors.protein, Colors.protein + '80']}
                  style={[styles.macroBar, { width: `${Math.min((dailyTotals.protein / targetProtein) * 100, 100)}%` }]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{Math.round(dailyTotals.carbs)}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
              <View style={styles.macroBarContainer}>
                <LinearGradient
                  colors={[Colors.carbs, Colors.carbs + '80']}
                  style={[styles.macroBar, { width: `${Math.min((dailyTotals.carbs / targetCarbs) * 100, 100)}%` }]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{Math.round(dailyTotals.fat)}g</Text>
              <Text style={styles.macroLabel}>Fat</Text>
              <View style={styles.macroBarContainer}>
                <LinearGradient
                  colors={[Colors.fat, Colors.fat + '80']}
                  style={[styles.macroBar, { width: `${Math.min((dailyTotals.fat / targetFat) * 100, 100)}%` }]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
            </View>
          </View>
        </GlassCard>

        {/* Meal Diary */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Meal Diary</Text>
          
          <View style={styles.mealList}>
            {mealData.map((meal, index) => (
              <View key={meal.name} style={styles.mealItem}>
                <View style={styles.mealHeader}>
                  <View style={styles.mealTitleContainer}>
                    {meal.icon}
                    <Text style={styles.mealName}>{meal.name}</Text>
                  </View>
                  <Text style={styles.mealCalories}>{Math.round(meal.totalCalories)} cal</Text>
                </View>
                
                {meal.entries.length > 0 ? (
                  <View style={styles.foodEntries}>
                    {meal.entries.map((entry) => (
                      <View key={entry.id} style={styles.foodEntry}>
                        <Text style={styles.foodName}>
                          {entry.food.name} {entry.food.brand && `(${entry.food.brand})`}
                        </Text>
                        <Text style={styles.foodDetails}>
                          {entry.quantity}x {entry.food.servingSize}{entry.food.servingUnit} • {Math.round(entry.food.calories * entry.quantity)} cal
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.mealFoods}>No foods logged</Text>
                )}
                
                <LuxuryButton
                  title="Add Food"
                  variant="outline"
                  size="small"
                  onPress={() => openFoodSearch(meal.name.toLowerCase() as any)}
                  style={styles.addFoodButton}
                  icon={<Plus size={16} color={Colors.gold} />}
                />
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Bottom padding for tab bar */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Barcode Scanner Modal */}
      <BarcodeScanner
        isVisible={showScanner}
        onBarcodeScanned={handleBarcodeScanned}
        onClose={() => setShowScanner(false)}
      />

      {/* Food Search Modal */}
      <Modal
        visible={showFoodSearch}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Search Food</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowFoodSearch(false)}
            >
              <X size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for food..."
              placeholderTextColor={Colors.gray}
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                handleFoodSearch(text);
              }}
              autoFocus
            />
            {isSearching && (
              <ActivityIndicator 
                style={styles.searchLoader} 
                color={Colors.gold} 
                size="small" 
              />
            )}
          </View>

          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.foodSearchItem}
                onPress={() => {
                  setSelectedFood(item);
                  setShowFoodSearch(false);
                  setShowAddFood(true);
                }}
              >
                <View style={styles.foodSearchInfo}>
                  <Text style={styles.foodSearchName}>{item.name}</Text>
                  {item.brand && <Text style={styles.foodSearchBrand}>{item.brand}</Text>}
                  <Text style={styles.foodSearchDetails}>
                    {item.calories} cal per {item.servingSize}{item.servingUnit}
                  </Text>
                </View>
                <View style={styles.foodSearchMacros}>
                  <Text style={styles.foodSearchMacro}>P: {item.protein}g</Text>
                  <Text style={styles.foodSearchMacro}>C: {item.carbs}g</Text>
                  <Text style={styles.foodSearchMacro}>F: {item.fat}g</Text>
                </View>
              </TouchableOpacity>
            )}
            style={styles.searchResults}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </Modal>

      {/* Add Food Modal */}
      <Modal
        visible={showAddFood}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Food</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowAddFood(false)}
            >
              <X size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {selectedFood && (
            <ScrollView style={styles.addFoodContent}>
              <GlassCard style={styles.selectedFoodCard}>
                <Text style={styles.selectedFoodName}>{selectedFood.name}</Text>
                {selectedFood.brand && (
                  <Text style={styles.selectedFoodBrand}>{selectedFood.brand}</Text>
                )}
                
                <View style={styles.nutritionInfo}>
                  <Text style={styles.nutritionTitle}>Nutrition per {selectedFood.servingSize}{selectedFood.servingUnit}</Text>
                  <View style={styles.nutritionGrid}>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>{selectedFood.calories}</Text>
                      <Text style={styles.nutritionLabel}>Calories</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>{selectedFood.protein}g</Text>
                      <Text style={styles.nutritionLabel}>Protein</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>{selectedFood.carbs}g</Text>
                      <Text style={styles.nutritionLabel}>Carbs</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>{selectedFood.fat}g</Text>
                      <Text style={styles.nutritionLabel}>Fat</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.quantityContainer}>
                  <Text style={styles.quantityLabel}>Quantity (servings)</Text>
                  <TextInput
                    style={styles.quantityInput}
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                    placeholder="1"
                    placeholderTextColor={Colors.gray}
                  />
                </View>

                <View style={styles.mealSelector}>
                  <Text style={styles.mealSelectorLabel}>Add to meal</Text>
                  <View style={styles.mealOptions}>
                    {['breakfast', 'lunch', 'dinner', 'snack'].map((meal) => (
                      <TouchableOpacity
                        key={meal}
                        style={[
                          styles.mealOption,
                          selectedMeal === meal && styles.mealOptionSelected
                        ]}
                        onPress={() => setSelectedMeal(meal as any)}
                      >
                        <Text style={[
                          styles.mealOptionText,
                          selectedMeal === meal && styles.mealOptionTextSelected
                        ]}>
                          {meal.charAt(0).toUpperCase() + meal.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <LuxuryButton
                  title="Add to Diary"
                  variant="gold"
                  onPress={handleAddFood}
                  style={styles.addButton}
                />
              </GlassCard>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Layout.screenPadding,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.fontSize.lg,
    color: Colors.gray,
  },
  
  card: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  cardTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.md,
  },
  
  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  
  // Calories Summary
  caloriesSummary: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  caloriesNumber: {
    fontSize: Typography.fontSize['5xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  caloriesLabel: {
    fontSize: Typography.fontSize.base,
    color: Colors.gray,
    marginBottom: Spacing.xs,
  },
  caloriesRemaining: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  
  // Macro Summary
  macroSummary: {
    gap: Spacing.lg,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  macroLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray,
    marginBottom: Spacing.sm,
  },
  macroBarContainer: {
    width: 80,
    height: 6,
    backgroundColor: Colors.darkGray,
    borderRadius: 3,
    overflow: 'hidden',
  },
  macroBar: {
    height: '100%',
    borderRadius: 3,
  },
  
  // Meal List
  mealList: {
    gap: Spacing.lg,
  },
  mealItem: {
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.darkGray,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  mealTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  mealName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  mealCalories: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.gold,
  },
  mealFoods: {
    fontSize: Typography.fontSize.base,
    color: Colors.gray,
    marginBottom: Spacing.md,
  },
  foodEntries: {
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  foodEntry: {
    paddingLeft: Spacing.md,
  },
  foodName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  foodDetails: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray,
  },
  addFoodButton: {
    alignSelf: 'flex-start',
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.darkGray,
  },
  modalTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.darkGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Search styles
  searchContainer: {
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.darkGray,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.white,
  },
  searchLoader: {
    marginLeft: Spacing.md,
  },
  searchResults: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  foodSearchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.darkGray,
    borderRadius: BorderRadius.md,
  },
  foodSearchInfo: {
    flex: 1,
  },
  foodSearchName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  foodSearchBrand: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray,
    marginBottom: Spacing.xs,
  },
  foodSearchDetails: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray,
  },
  foodSearchMacros: {
    alignItems: 'flex-end',
    gap: 2,
  },
  foodSearchMacro: {
    fontSize: Typography.fontSize.xs,
    color: Colors.gray,
  },
  
  // Add food styles
  addFoodContent: {
    flex: 1,
    padding: Spacing.lg,
  },
  selectedFoodCard: {
    padding: Spacing.xl,
  },
  selectedFoodName: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  selectedFoodBrand: {
    fontSize: Typography.fontSize.lg,
    color: Colors.gray,
    marginBottom: Spacing.xl,
  },
  nutritionInfo: {
    marginBottom: Spacing.xl,
  },
  nutritionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.gray,
    marginBottom: Spacing.md,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  nutritionLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray,
  },
  quantityContainer: {
    marginBottom: Spacing.xl,
  },
  quantityLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  quantityInput: {
    height: 48,
    backgroundColor: Colors.darkGray,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.white,
  },
  mealSelector: {
    marginBottom: Spacing.xl,
  },
  mealSelectorLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.white,
    marginBottom: Spacing.md,
  },
  mealOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  mealOption: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.darkGray,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  mealOptionSelected: {
    backgroundColor: Colors.gold,
  },
  mealOptionText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.gray,
  },
  mealOptionTextSelected: {
    color: Colors.background,
  },
  addButton: {
    marginTop: Spacing.md,
  },
  
  bottomPadding: {
    height: 120,
  },
});
