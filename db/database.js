import * as SQLite from "expo-sqlite";

// Database instance
let db = null;

// Initialize database connection
export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync("vehicleRental.db");
    console.log("Database initialized:", db);

    // Create tables using execAsync for bulk operations
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        isAdmin INTEGER DEFAULT 0,
        email TEXT,
        phone TEXT
      );

      CREATE TABLE IF NOT EXISTS vehicles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        model TEXT NOT NULL,
        brand TEXT NOT NULL,
        year INTEGER,
        licensePlate TEXT UNIQUE,
        dailyRate REAL NOT NULL,
        isAvailable INTEGER DEFAULT 1,
        imageUrl TEXT
      );

      CREATE TABLE IF NOT EXISTS rentals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        vehicleId INTEGER,
        startDate TEXT NOT NULL,
        endDate TEXT NOT NULL,
        totalCost REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        FOREIGN KEY (userId) REFERENCES users (id),
        FOREIGN KEY (vehicleId) REFERENCES vehicles (id)
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rentalId INTEGER,
        rating INTEGER NOT NULL,
        comment TEXT,
        date TEXT NOT NULL,
        FOREIGN KEY (rentalId) REFERENCES rentals (id)
      );
    `);

    // Create a default admin user if not exists
    const adminUser = {
      username: "admin",
      password: "admin",
      isAdmin: 1,
    };

    const adminUsers = await db.getAllAsync(
      "SELECT * FROM users WHERE isAdmin = 1",
    );

    if (adminUsers.length === 0) {
      await db.runAsync(
        `INSERT INTO users (username, password, isAdmin)
         VALUES (?, ?, ?)`,
        [adminUser.username, adminUser.password, adminUser.isAdmin],
      );
    }

    const vehicles = await vehicleOperations.getAvailableVehicles();

    if (vehicles.length === 0) {
      vehicleOperations.addVehicle({
        type: "SUV",
        model: "X5",
        brand: "BMW",
        year: 2021,
        licensePlate: "ABC123",
        dailyRate: 100,
        imageUrl: "https://via.placeholder.com/150",
      });

      vehicleOperations.addVehicle({
        type: "Sedan",
        model: "Camry",
        brand: "Toyota",
        year: 2020,
        licensePlate: "XYZ456",
        dailyRate: 80,
        imageUrl: "https://via.placeholder.com/150",
      });

      vehicleOperations.addVehicle({
        type: "SUV",
        model: "Highlander",
        brand: "Toyota",
        year: 2021,
        licensePlate: "DEF789",
        dailyRate: 90,
        imageUrl: "https://via.placeholder.com/150",
      });

      vehicleOperations.addVehicle({
        type: "Sedan",
        model: "Accord",
        brand: "Honda",
        year: 2020,
        licensePlate: "GHI101",
        dailyRate: 75,
        imageUrl: "https://via.placeholder.com/150",
      });
    }
    return true;
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
};

// Helper function to ensure database is initialized
const ensureDatabase = () => {
  if (!db) {
    throw new Error("Database not initialized. Call initDatabase() first.");
  }
  return db;
};

// Database operations for Vehicles
export const vehicleOperations = {
  getAllVehicles: async () => {
    const database = ensureDatabase();
    const vehicles = await database.getAllAsync("SELECT * FROM vehicles");
    return vehicles;
  },
  addVehicle: async (vehicle) => {
    const database = ensureDatabase();
    const result = await database.runAsync(
      `INSERT INTO vehicles (type, model, brand, year, licensePlate, dailyRate, imageUrl)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        vehicle.type,
        vehicle.model,
        vehicle.brand,
        vehicle.year,
        vehicle.licensePlate,
        vehicle.dailyRate,
        vehicle.imageUrl,
      ],
    );
    return result;
  },

  getAvailableVehicles: async () => {
    const database = ensureDatabase();
    const vehicles = await database.getAllAsync(
      "SELECT * FROM vehicles WHERE isAvailable = 1",
    );
    return vehicles;
  },

  updateVehicleAvailability: async (vehicleId, isAvailable) => {
    const database = ensureDatabase();
    const result = await database.runAsync(
      "UPDATE vehicles SET isAvailable = ? WHERE id = ?",
      [isAvailable ? 1 : 0, vehicleId],
    );
    return result;
  },
};

// Database operations for Rentals
export const rentalOperations = {
  createRental: async (rental) => {
    const database = ensureDatabase();
    const result = await database.runAsync(
      `INSERT INTO rentals (userId, vehicleId, startDate, endDate, totalCost, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        rental.userId,
        rental.vehicleId,
        rental.startDate,
        rental.endDate,
        rental.totalCost,
        rental.status,
      ],
    );
    return result;
  },

  getUserRentals: async (userId) => {
    const database = ensureDatabase();
    const rentals = await database.getAllAsync(
      `SELECT r.*, v.model, v.brand, v.licensePlate 
       FROM rentals r 
       JOIN vehicles v ON r.vehicleId = v.id 
       WHERE r.userId = ?`,
      [userId],
    );
    return rentals;
  },

  updateRentalStatus: async (rentalId, status) => {
    const database = ensureDatabase();
    const result = await database.runAsync(
      "UPDATE rentals SET status = ? WHERE id = ?",
      [status, rentalId],
    );
    return result;
  },
};

export const userOperations = {
  getUserByUsername: async (username) => {
    const database = ensureDatabase();
    const user = await database.getFirstAsync(
      "SELECT * FROM users WHERE username = ?",
      [username],
    );
    return user;
  },
  addUser: async (user) => {
    const database = ensureDatabase();
    const result = await database.runAsync(
      `INSERT INTO users (username, password, email, phone)
       VALUES (?, ?, ?, ?)`,
      [user.username, user.password, user.email, user.phone],
    );
    return result;
  },
  loginUser: async (username, password) => {
    const database = ensureDatabase();
    const user = await database.getFirstAsync(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password],
    );
    return user;
  },
};
