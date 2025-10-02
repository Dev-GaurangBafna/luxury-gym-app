import * as SQLite from 'expo-sqlite';
import { 
  User, 
  UserProfile, 
  Exercise, 
  Workout, 
  WorkoutExercise, 
  WorkoutSet,
  WorkoutTemplate,
  Food, 
  FoodEntry, 
  Recipe,
  BodyMeasurement,
  ProgressPhoto,
  PersonalRecord,
  HealthData,
  SleepData,
  AIConversation,
  AIMessage
} from '../types';

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initialize(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync('luxury_gym.db');
      await this.createTables();
      await this.seedInitialData();
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const tables = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        avatar TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // User profiles table
      `CREATE TABLE IF NOT EXISTS user_profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        age INTEGER,
        height REAL,
        weight REAL,
        body_fat REAL,
        activity_level TEXT NOT NULL,
        fitness_goal TEXT NOT NULL,
        target_calories INTEGER,
        target_protein REAL,
        target_carbs REAL,
        target_fat REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`,

      // Exercises table
      `CREATE TABLE IF NOT EXISTS exercises (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        primary_muscles TEXT NOT NULL,
        secondary_muscles TEXT,
        equipment TEXT,
        instructions TEXT,
        video_url TEXT,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Workouts table
      `CREATE TABLE IF NOT EXISTS workouts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        template_id TEXT,
        start_time DATETIME NOT NULL,
        end_time DATETIME,
        duration INTEGER,
        total_volume REAL,
        notes TEXT,
        is_completed BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (template_id) REFERENCES workout_templates (id)
      )`,

      // Workout exercises table
      `CREATE TABLE IF NOT EXISTS workout_exercises (
        id TEXT PRIMARY KEY,
        workout_id TEXT NOT NULL,
        exercise_id TEXT NOT NULL,
        order_index INTEGER NOT NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (workout_id) REFERENCES workouts (id),
        FOREIGN KEY (exercise_id) REFERENCES exercises (id)
      )`,

      // Workout sets table
      `CREATE TABLE IF NOT EXISTS workout_sets (
        id TEXT PRIMARY KEY,
        workout_exercise_id TEXT NOT NULL,
        reps INTEGER NOT NULL,
        weight REAL,
        duration INTEGER,
        distance REAL,
        rpe INTEGER,
        rest_time INTEGER,
        notes TEXT,
        is_warmup BOOLEAN DEFAULT FALSE,
        is_drop_set BOOLEAN DEFAULT FALSE,
        is_failure BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (workout_exercise_id) REFERENCES workout_exercises (id)
      )`,

      // Workout templates table
      `CREATE TABLE IF NOT EXISTS workout_templates (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        exercises TEXT NOT NULL,
        is_public BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`,

      // Foods table
      `CREATE TABLE IF NOT EXISTS foods (
        id TEXT PRIMARY KEY,
        barcode TEXT,
        name TEXT NOT NULL,
        brand TEXT,
        serving_size REAL NOT NULL,
        serving_unit TEXT NOT NULL,
        calories REAL NOT NULL,
        protein REAL NOT NULL,
        carbs REAL NOT NULL,
        fat REAL NOT NULL,
        fiber REAL,
        sugar REAL,
        sodium REAL,
        image_url TEXT,
        source TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Food entries table
      `CREATE TABLE IF NOT EXISTS food_entries (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        food_id TEXT NOT NULL,
        quantity REAL NOT NULL,
        meal TEXT NOT NULL,
        logged_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (food_id) REFERENCES foods (id)
      )`,

      // Recipes table
      `CREATE TABLE IF NOT EXISTS recipes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        servings INTEGER NOT NULL,
        ingredients TEXT NOT NULL,
        instructions TEXT NOT NULL,
        image_url TEXT,
        total_calories REAL NOT NULL,
        total_protein REAL NOT NULL,
        total_carbs REAL NOT NULL,
        total_fat REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`,

      // Body measurements table
      `CREATE TABLE IF NOT EXISTS body_measurements (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL,
        value REAL NOT NULL,
        unit TEXT NOT NULL,
        measured_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`,

      // Progress photos table
      `CREATE TABLE IF NOT EXISTS progress_photos (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        image_url TEXT NOT NULL,
        type TEXT NOT NULL,
        notes TEXT,
        taken_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`,

      // Personal records table
      `CREATE TABLE IF NOT EXISTS personal_records (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        exercise_id TEXT NOT NULL,
        type TEXT NOT NULL,
        value REAL NOT NULL,
        unit TEXT NOT NULL,
        workout_id TEXT,
        achieved_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (exercise_id) REFERENCES exercises (id),
        FOREIGN KEY (workout_id) REFERENCES workouts (id)
      )`,

      // Health data table
      `CREATE TABLE IF NOT EXISTS health_data (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL,
        value REAL NOT NULL,
        unit TEXT NOT NULL,
        source TEXT NOT NULL,
        recorded_at DATETIME NOT NULL,
        synced_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`,

      // Sleep data table
      `CREATE TABLE IF NOT EXISTS sleep_data (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        bed_time DATETIME NOT NULL,
        wake_time DATETIME NOT NULL,
        duration INTEGER NOT NULL,
        deep_sleep INTEGER,
        rem_sleep INTEGER,
        light_sleep INTEGER,
        quality INTEGER,
        source TEXT NOT NULL,
        recorded_at DATETIME NOT NULL,
        synced_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`,

      // AI conversations table
      `CREATE TABLE IF NOT EXISTS ai_conversations (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`,

      // AI messages table
      `CREATE TABLE IF NOT EXISTS ai_messages (
        id TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL,
        content TEXT NOT NULL,
        role TEXT NOT NULL,
        metadata TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES ai_conversations (id)
      )`
    ];

    for (const table of tables) {
      await this.db.execAsync(table);
    }

    // Create indexes for better performance
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts (user_id)',
      'CREATE INDEX IF NOT EXISTS idx_workouts_start_time ON workouts (start_time)',
      'CREATE INDEX IF NOT EXISTS idx_food_entries_user_id ON food_entries (user_id)',
      'CREATE INDEX IF NOT EXISTS idx_food_entries_logged_at ON food_entries (logged_at)',
      'CREATE INDEX IF NOT EXISTS idx_body_measurements_user_id ON body_measurements (user_id)',
      'CREATE INDEX IF NOT EXISTS idx_body_measurements_measured_at ON body_measurements (measured_at)',
      'CREATE INDEX IF NOT EXISTS idx_health_data_user_id ON health_data (user_id)',
      'CREATE INDEX IF NOT EXISTS idx_health_data_recorded_at ON health_data (recorded_at)',
    ];

    for (const index of indexes) {
      await this.db.execAsync(index);
    }
  }

  private async seedInitialData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Check if exercises already exist
    const existingExercises = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM exercises');
    if ((existingExercises as any)?.count > 0) return;

    // Seed basic exercises
    const exercises = [
      {
        id: 'bench-press',
        name: 'Bench Press',
        category: 'chest',
        primaryMuscles: JSON.stringify(['chest', 'triceps']),
        secondaryMuscles: JSON.stringify(['shoulders']),
        equipment: JSON.stringify(['barbell', 'bench']),
        instructions: JSON.stringify([
          'Lie flat on bench with feet on floor',
          'Grip bar slightly wider than shoulder width',
          'Lower bar to chest with control',
          'Press bar up explosively',
          'Keep core tight throughout movement'
        ])
      },
      {
        id: 'squat',
        name: 'Squat',
        category: 'legs',
        primaryMuscles: JSON.stringify(['quadriceps', 'glutes']),
        secondaryMuscles: JSON.stringify(['hamstrings', 'calves']),
        equipment: JSON.stringify(['barbell', 'squat-rack']),
        instructions: JSON.stringify([
          'Position bar on upper back',
          'Stand with feet shoulder-width apart',
          'Lower by pushing hips back and bending knees',
          'Descend until thighs parallel to floor',
          'Drive through heels to return to start'
        ])
      },
      {
        id: 'deadlift',
        name: 'Deadlift',
        category: 'back',
        primaryMuscles: JSON.stringify(['hamstrings', 'glutes', 'back']),
        secondaryMuscles: JSON.stringify(['traps', 'forearms']),
        equipment: JSON.stringify(['barbell']),
        instructions: JSON.stringify([
          'Stand with feet hip-width apart',
          'Grip bar with hands just outside legs',
          'Keep back straight and chest up',
          'Lift by extending hips and knees',
          'Stand tall at top, then lower with control'
        ])
      },
      {
        id: 'overhead-press',
        name: 'Overhead Press',
        category: 'shoulders',
        primaryMuscles: JSON.stringify(['shoulders']),
        secondaryMuscles: JSON.stringify(['triceps', 'core']),
        equipment: JSON.stringify(['barbell']),
        instructions: JSON.stringify([
          'Stand with feet shoulder-width apart',
          'Hold bar at shoulder level',
          'Press bar straight up overhead',
          'Keep core tight and avoid arching back',
          'Lower bar back to shoulders with control'
        ])
      },
      {
        id: 'pull-up',
        name: 'Pull-up',
        category: 'back',
        primaryMuscles: JSON.stringify(['lats', 'rhomboids']),
        secondaryMuscles: JSON.stringify(['biceps', 'rear-delts']),
        equipment: JSON.stringify(['pull-up-bar']),
        instructions: JSON.stringify([
          'Hang from bar with overhand grip',
          'Pull body up until chin over bar',
          'Squeeze shoulder blades together',
          'Lower with control to full extension',
          'Maintain straight body throughout'
        ])
      }
    ];

    for (const exercise of exercises) {
      await this.db.runAsync(
        `INSERT INTO exercises (id, name, category, primary_muscles, secondary_muscles, equipment, instructions) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          exercise.id,
          exercise.name,
          exercise.category,
          exercise.primaryMuscles,
          exercise.secondaryMuscles,
          exercise.equipment,
          exercise.instructions
        ]
      );
    }
  }

  // User methods
  async createUser(user: Omit<User, 'createdAt' | 'updatedAt'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.runAsync(
      'INSERT INTO users (id, email, name, avatar) VALUES (?, ?, ?, ?)',
      [user.id, user.email, user.name, user.avatar || null]
    );
  }

  async getUserById(id: string): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getFirstAsync(
      'SELECT * FROM users WHERE id = ?',
      [id]
    ) as any;

    if (!result) return null;

    return {
      id: result.id,
      email: result.email,
      name: result.name,
      avatar: result.avatar,
      createdAt: new Date(result.created_at),
      updatedAt: new Date(result.updated_at)
    };
  }

  // Exercise methods
  async getAllExercises(): Promise<Exercise[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const results = await this.db.getAllAsync('SELECT * FROM exercises ORDER BY name') as any[];
    
    return results.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category,
      primaryMuscles: JSON.parse(row.primary_muscles),
      secondaryMuscles: JSON.parse(row.secondary_muscles || '[]'),
      equipment: JSON.parse(row.equipment || '[]'),
      instructions: JSON.parse(row.instructions || '[]'),
      videoUrl: row.video_url,
      imageUrl: row.image_url,
      createdAt: new Date(row.created_at)
    }));
  }

  async getExercisesByCategory(category: string): Promise<Exercise[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const results = await this.db.getAllAsync(
      'SELECT * FROM exercises WHERE category = ? ORDER BY name',
      [category]
    ) as any[];
    
    return results.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category,
      primaryMuscles: JSON.parse(row.primary_muscles),
      secondaryMuscles: JSON.parse(row.secondary_muscles || '[]'),
      equipment: JSON.parse(row.equipment || '[]'),
      instructions: JSON.parse(row.instructions || '[]'),
      videoUrl: row.video_url,
      imageUrl: row.image_url,
      createdAt: new Date(row.created_at)
    }));
  }

  // Food methods
  async createFood(food: Omit<Food, 'createdAt' | 'updatedAt'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.runAsync(
      `INSERT INTO foods (id, barcode, name, brand, serving_size, serving_unit, 
       calories, protein, carbs, fat, fiber, sugar, sodium, image_url, source) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        food.id, food.barcode, food.name, food.brand, food.servingSize, 
        food.servingUnit, food.calories, food.protein, food.carbs, food.fat,
        food.fiber, food.sugar, food.sodium, food.imageUrl, food.source
      ]
    );
  }

  async getFoodByBarcode(barcode: string): Promise<Food | null> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getFirstAsync(
      'SELECT * FROM foods WHERE barcode = ?',
      [barcode]
    ) as any;

    if (!result) return null;

    return {
      id: result.id,
      barcode: result.barcode,
      name: result.name,
      brand: result.brand,
      servingSize: result.serving_size,
      servingUnit: result.serving_unit,
      calories: result.calories,
      protein: result.protein,
      carbs: result.carbs,
      fat: result.fat,
      fiber: result.fiber,
      sugar: result.sugar,
      sodium: result.sodium,
      imageUrl: result.image_url,
      source: result.source,
      createdAt: new Date(result.created_at),
      updatedAt: new Date(result.updated_at)
    };
  }

  async searchFoods(query: string, limit: number = 20): Promise<Food[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const results = await this.db.getAllAsync(
      'SELECT * FROM foods WHERE name LIKE ? OR brand LIKE ? ORDER BY name LIMIT ?',
      [`%${query}%`, `%${query}%`, limit]
    ) as any[];
    
    return results.map(row => ({
      id: row.id,
      barcode: row.barcode,
      name: row.name,
      brand: row.brand,
      servingSize: row.serving_size,
      servingUnit: row.serving_unit,
      calories: row.calories,
      protein: row.protein,
      carbs: row.carbs,
      fat: row.fat,
      fiber: row.fiber,
      sugar: row.sugar,
      sodium: row.sodium,
      imageUrl: row.image_url,
      source: row.source,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    }));
  }

  // Food entry methods
  async createFoodEntry(entry: Omit<FoodEntry, 'createdAt' | 'food'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.runAsync(
      'INSERT INTO food_entries (id, user_id, food_id, quantity, meal, logged_at) VALUES (?, ?, ?, ?, ?, ?)',
      [entry.id, entry.userId, entry.foodId, entry.quantity, entry.meal, entry.loggedAt.toISOString()]
    );
  }

  async getFoodEntriesByDate(userId: string, date: Date): Promise<FoodEntry[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const results = await this.db.getAllAsync(
      `SELECT fe.*, f.* FROM food_entries fe 
       JOIN foods f ON fe.food_id = f.id 
       WHERE fe.user_id = ? AND fe.logged_at BETWEEN ? AND ? 
       ORDER BY fe.logged_at`,
      [userId, startOfDay.toISOString(), endOfDay.toISOString()]
    ) as any[];
    
    return results.map(row => ({
      id: row.id,
      userId: row.user_id,
      foodId: row.food_id,
      food: {
        id: row.food_id,
        barcode: row.barcode,
        name: row.name,
        brand: row.brand,
        servingSize: row.serving_size,
        servingUnit: row.serving_unit,
        calories: row.calories,
        protein: row.protein,
        carbs: row.carbs,
        fat: row.fat,
        fiber: row.fiber,
        sugar: row.sugar,
        sodium: row.sodium,
        imageUrl: row.image_url,
        source: row.source,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      },
      quantity: row.quantity,
      meal: row.meal,
      loggedAt: new Date(row.logged_at),
      createdAt: new Date(row.created_at)
    }));
  }

  // Body measurement methods
  async createBodyMeasurement(measurement: Omit<BodyMeasurement, 'createdAt'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.runAsync(
      'INSERT INTO body_measurements (id, user_id, type, value, unit, measured_at) VALUES (?, ?, ?, ?, ?, ?)',
      [measurement.id, measurement.userId, measurement.type, measurement.value, measurement.unit, measurement.measuredAt.toISOString()]
    );
  }

  async getBodyMeasurements(userId: string, type: string, limit: number = 30): Promise<BodyMeasurement[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const results = await this.db.getAllAsync(
      'SELECT * FROM body_measurements WHERE user_id = ? AND type = ? ORDER BY measured_at DESC LIMIT ?',
      [userId, type, limit]
    ) as any[];
    
    return results.map(row => ({
      id: row.id,
      userId: row.user_id,
      type: row.type,
      value: row.value,
      unit: row.unit,
      measuredAt: new Date(row.measured_at),
      createdAt: new Date(row.created_at)
    }));
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}

export const databaseService = new DatabaseService();
