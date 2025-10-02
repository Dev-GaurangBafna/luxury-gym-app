import { OpenFoodFactsProduct, Food } from '../types';

class OpenFoodFactsService {
  private readonly baseUrl = 'https://world.openfoodfacts.org/api/v0';

  /**
   * Search for a product by barcode
   */
  async getProductByBarcode(barcode: string): Promise<Food | null> {
    try {
      const response = await fetch(`${this.baseUrl}/product/${barcode}.json`);
      const data: OpenFoodFactsProduct = await response.json();

      if (!data.product || !data.product.product_name) {
        return null;
      }

      return this.transformToFood(data);
    } catch (error) {
      console.error('Error fetching product by barcode:', error);
      return null;
    }
  }

  /**
   * Search for products by name
   */
  async searchProducts(query: string, page: number = 1, pageSize: number = 20): Promise<Food[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page=${page}&page_size=${pageSize}`
      );
      const data = await response.json();

      if (!data.products || !Array.isArray(data.products)) {
        return [];
      }

      return data.products
        .filter((product: any) => product.product_name && product.nutriments)
        .map((product: any) => this.transformToFood({ code: product.code, product }))
        .filter((food: Food | null) => food !== null) as Food[];
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(category: string, page: number = 1, pageSize: number = 20): Promise<Food[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/cgi/search.pl?tagtype_0=categories&tag_contains_0=contains&tag_0=${encodeURIComponent(category)}&action=process&json=1&page=${page}&page_size=${pageSize}`
      );
      const data = await response.json();

      if (!data.products || !Array.isArray(data.products)) {
        return [];
      }

      return data.products
        .filter((product: any) => product.product_name && product.nutriments)
        .map((product: any) => this.transformToFood({ code: product.code, product }))
        .filter((food: Food | null) => food !== null) as Food[];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }

  /**
   * Get popular products
   */
  async getPopularProducts(pageSize: number = 50): Promise<Food[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/cgi/search.pl?sort_by=popularity&action=process&json=1&page_size=${pageSize}`
      );
      const data = await response.json();

      if (!data.products || !Array.isArray(data.products)) {
        return [];
      }

      return data.products
        .filter((product: any) => product.product_name && product.nutriments)
        .map((product: any) => this.transformToFood({ code: product.code, product }))
        .filter((food: Food | null) => food !== null) as Food[];
    } catch (error) {
      console.error('Error fetching popular products:', error);
      return [];
    }
  }

  /**
   * Transform OpenFoodFacts product to our Food type
   */
  private transformToFood(data: OpenFoodFactsProduct): Food | null {
    try {
      const { code, product } = data;
      const { nutriments } = product;

      // Validate required fields
      if (!product.product_name || !nutriments) {
        return null;
      }

      // Extract nutritional values per 100g (OpenFoodFacts standard)
      const calories = nutriments['energy-kcal_100g'] || 0;
      const protein = nutriments['proteins_100g'] || 0;
      const carbs = nutriments['carbohydrates_100g'] || 0;
      const fat = nutriments['fat_100g'] || 0;
      const fiber = nutriments['fiber_100g'] || undefined;
      const sugar = nutriments['sugars_100g'] || undefined;
      const sodium = nutriments['sodium_100g'] || undefined;

      // Determine serving size
      let servingSize = 100; // Default to 100g
      let servingUnit = 'g';

      if (product.serving_size) {
        const servingMatch = product.serving_size.match(/(\d+(?:\.\d+)?)\s*(\w+)?/);
        if (servingMatch) {
          servingSize = parseFloat(servingMatch[1]);
          servingUnit = servingMatch[2] || 'g';
        }
      } else if (product.serving_quantity) {
        servingSize = product.serving_quantity;
      }

      // Calculate nutritional values per serving
      const servingMultiplier = servingSize / 100;

      return {
        id: `off_${code}`,
        barcode: code,
        name: product.product_name,
        brand: product.brands || undefined,
        servingSize,
        servingUnit,
        calories: Math.round(calories * servingMultiplier),
        protein: Math.round(protein * servingMultiplier * 10) / 10,
        carbs: Math.round(carbs * servingMultiplier * 10) / 10,
        fat: Math.round(fat * servingMultiplier * 10) / 10,
        fiber: fiber ? Math.round(fiber * servingMultiplier * 10) / 10 : undefined,
        sugar: sugar ? Math.round(sugar * servingMultiplier * 10) / 10 : undefined,
        sodium: sodium ? Math.round(sodium * servingMultiplier * 10) / 10 : undefined,
        imageUrl: product.image_url || undefined,
        source: 'openfoodfacts',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('Error transforming OpenFoodFacts product:', error);
      return null;
    }
  }

  /**
   * Validate barcode format
   */
  isValidBarcode(barcode: string): boolean {
    // Remove any non-digit characters
    const cleanBarcode = barcode.replace(/\D/g, '');
    
    // Check if it's a valid length (UPC-A: 12, EAN-13: 13, EAN-8: 8)
    const validLengths = [8, 12, 13, 14];
    return validLengths.includes(cleanBarcode.length);
  }

  /**
   * Clean and format barcode
   */
  formatBarcode(barcode: string): string {
    return barcode.replace(/\D/g, '');
  }

  /**
   * Get product suggestions based on partial name
   */
  async getProductSuggestions(query: string, limit: number = 10): Promise<string[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/cgi/suggest.pl?tagtype=products&string=${encodeURIComponent(query)}&limit=${limit}`
      );
      const data = await response.json();

      if (!data.suggestions || !Array.isArray(data.suggestions)) {
        return [];
      }

      return data.suggestions.map((suggestion: any) => suggestion.name || suggestion);
    } catch (error) {
      console.error('Error fetching product suggestions:', error);
      return [];
    }
  }

  /**
   * Get nutrition facts for a specific amount
   */
  calculateNutritionForAmount(food: Food, amount: number, unit: string = 'g'): {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
  } {
    // Convert amount to grams if needed
    let amountInGrams = amount;
    if (unit === 'kg') {
      amountInGrams = amount * 1000;
    } else if (unit === 'oz') {
      amountInGrams = amount * 28.35;
    } else if (unit === 'lb') {
      amountInGrams = amount * 453.59;
    }

    // Calculate multiplier based on serving size
    const multiplier = amountInGrams / food.servingSize;

    return {
      calories: Math.round(food.calories * multiplier),
      protein: Math.round(food.protein * multiplier * 10) / 10,
      carbs: Math.round(food.carbs * multiplier * 10) / 10,
      fat: Math.round(food.fat * multiplier * 10) / 10,
      fiber: food.fiber ? Math.round(food.fiber * multiplier * 10) / 10 : undefined,
      sugar: food.sugar ? Math.round(food.sugar * multiplier * 10) / 10 : undefined,
      sodium: food.sodium ? Math.round(food.sodium * multiplier * 10) / 10 : undefined,
    };
  }

  /**
   * Check if OpenFoodFacts API is available
   */
  async checkApiHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/product/3017620422003.json`, {
        method: 'HEAD',
        timeout: 5000,
      });
      return response.ok;
    } catch (error) {
      console.error('OpenFoodFacts API health check failed:', error);
      return false;
    }
  }

  /**
   * Get product categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/categories.json`);
      const data = await response.json();

      if (!data.tags || !Array.isArray(data.tags)) {
        return [];
      }

      return data.tags
        .filter((tag: any) => tag.name && tag.products > 100) // Only categories with substantial products
        .map((tag: any) => tag.name)
        .slice(0, 50); // Limit to top 50 categories
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }
}

export const openFoodFactsService = new OpenFoodFactsService();
