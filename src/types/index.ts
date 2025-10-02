// User and Profile Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  age?: number;
  height?: number; // in cm
  weight?: number; // in kg
  bodyFat?: number; // percentage
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  fitnessGoal: 'lose_weight' | 'maintain_weight' | 'gain_weight' | 'build_muscle' | 'improve_endurance';
  targetCalories?: number;
  targetProtein?: number; // in grams
  targetCarbs?: number; // in grams
  targetFat?: number; // in grams
  createdAt: Date;
  updatedAt: Date;
}

// Workout Types
export interface Exercise {
  id: string;
  name: string;
  category: 'chest' | 'back' | 'shoulders' | 'arms' | 'legs' | 'core' | 'cardio' | 'other';
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string[];
  instructions: string[];
  videoUrl?: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface WorkoutSet {
  id: string;
  exerciseId: string;
  reps: number;
  weight?: number; // in kg
  duration?: number; // in seconds for time-based exercises
  distance?: number; // in meters for cardio
  rpe?: number; // Rate of Perceived Exertion (1-10)
  restTime?: number; // in seconds
  notes?: string;
  isWarmup?: boolean;
  isDropSet?: boolean;
  isFailure?: boolean;
  createdAt: Date;
}

export interface WorkoutExercise {
  id: string;
  workoutId: string;
  exerciseId: string;
  exercise: Exercise;
  sets: WorkoutSet[];
  order: number;
  notes?: string;
  createdAt: Date;
}

export interface Workout {
  id: string;
  userId: string;
  name: string;
  templateId?: string;
  exercises: WorkoutExercise[];
  startTime: Date;
  endTime?: Date;
  duration?: number; // in seconds
  totalVolume?: number; // total weight lifted
  notes?: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutTemplate {
  id: string;
  userId: string;
  name: string;
  description?: string;
  exercises: {
    exerciseId: string;
    order: number;
    targetSets: number;
    targetReps?: number;
    targetWeight?: number;
    restTime?: number;
  }[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Nutrition Types
export interface Food {
  id: string;
  barcode?: string;
  name: string;
  brand?: string;
  servingSize: number; // in grams
  servingUnit: string;
  calories: number; // per serving
  protein: number; // in grams per serving
  carbs: number; // in grams per serving
  fat: number; // in grams per serving
  fiber?: number;
  sugar?: number;
  sodium?: number;
  imageUrl?: string;
  source: 'openfoodfacts' | 'usda' | 'custom';
  createdAt: Date;
  updatedAt: Date;
}

export interface FoodEntry {
  id: string;
  userId: string;
  foodId: string;
  food: Food;
  quantity: number; // multiplier of serving size
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  loggedAt: Date;
  createdAt: Date;
}

export interface Recipe {
  id: string;
  userId: string;
  name: string;
  description?: string;
  servings: number;
  ingredients: {
    foodId: string;
    quantity: number;
  }[];
  instructions: string[];
  imageUrl?: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  createdAt: Date;
  updatedAt: Date;
}

// Progress Types
export interface BodyMeasurement {
  id: string;
  userId: string;
  type: 'weight' | 'body_fat' | 'muscle_mass' | 'waist' | 'chest' | 'arms' | 'thighs' | 'neck';
  value: number;
  unit: string;
  measuredAt: Date;
  createdAt: Date;
}

export interface ProgressPhoto {
  id: string;
  userId: string;
  imageUrl: string;
  type: 'front' | 'side' | 'back';
  notes?: string;
  takenAt: Date;
  createdAt: Date;
}

export interface PersonalRecord {
  id: string;
  userId: string;
  exerciseId: string;
  exercise: Exercise;
  type: '1rm' | 'volume' | 'reps' | 'time' | 'distance';
  value: number;
  unit: string;
  workoutId?: string;
  achievedAt: Date;
  createdAt: Date;
}

// Health Integration Types
export interface HealthData {
  id: string;
  userId: string;
  type: 'steps' | 'heart_rate' | 'sleep' | 'calories_burned' | 'active_minutes';
  value: number;
  unit: string;
  source: 'apple_health' | 'health_connect' | 'whoop' | 'manual';
  recordedAt: Date;
  syncedAt: Date;
}

export interface SleepData {
  id: string;
  userId: string;
  bedTime: Date;
  wakeTime: Date;
  duration: number; // in minutes
  deepSleep?: number; // in minutes
  remSleep?: number; // in minutes
  lightSleep?: number; // in minutes
  quality?: number; // 1-10 scale
  source: 'apple_health' | 'health_connect' | 'whoop' | 'manual';
  recordedAt: Date;
  syncedAt: Date;
}

// AI Assistant Types
export interface AIConversation {
  id: string;
  userId: string;
  title: string;
  messages: AIMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AIMessage {
  id: string;
  conversationId: string;
  content: string;
  role: 'user' | 'assistant';
  metadata?: {
    workoutGenerated?: boolean;
    nutritionAdvice?: boolean;
    exerciseForm?: boolean;
  };
  createdAt: Date;
}

// Analytics Types
export interface WorkoutAnalytics {
  totalWorkouts: number;
  totalVolume: number;
  averageDuration: number;
  strengthProgress: {
    exerciseId: string;
    exerciseName: string;
    startWeight: number;
    currentWeight: number;
    improvement: number;
  }[];
  weeklyFrequency: number;
  monthlyFrequency: number;
}

export interface NutritionAnalytics {
  averageCalories: number;
  averageProtein: number;
  averageCarbs: number;
  averageFat: number;
  adherenceRate: number; // percentage of days hitting targets
  streakDays: number;
  topFoods: {
    foodId: string;
    foodName: string;
    frequency: number;
  }[];
}

// API Response Types
export interface OpenFoodFactsProduct {
  code: string;
  product: {
    product_name: string;
    brands?: string;
    image_url?: string;
    nutriments: {
      'energy-kcal_100g': number;
      'proteins_100g': number;
      'carbohydrates_100g': number;
      'fat_100g': number;
      'fiber_100g'?: number;
      'sugars_100g'?: number;
      'sodium_100g'?: number;
    };
    serving_size?: string;
    serving_quantity?: number;
  };
}

// Database Schema Types
export interface DatabaseTables {
  users: User;
  user_profiles: UserProfile;
  exercises: Exercise;
  workouts: Workout;
  workout_exercises: WorkoutExercise;
  workout_sets: WorkoutSet;
  workout_templates: WorkoutTemplate;
  foods: Food;
  food_entries: FoodEntry;
  recipes: Recipe;
  body_measurements: BodyMeasurement;
  progress_photos: ProgressPhoto;
  personal_records: PersonalRecord;
  health_data: HealthData;
  sleep_data: SleepData;
  ai_conversations: AIConversation;
  ai_messages: AIMessage;
}

// Utility Types
export type MacroNutrients = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type DateRange = {
  start: Date;
  end: Date;
};

export type SortOrder = 'asc' | 'desc';

export type PaginationParams = {
  page: number;
  limit: number;
};

export type FilterParams = {
  dateRange?: DateRange;
  category?: string;
  search?: string;
};
