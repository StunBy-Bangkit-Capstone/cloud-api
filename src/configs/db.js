const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  errorFormat: "pretty",
  log: ["query", "info", "warn", "error"],
});

async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("Koneksi database berhasil.");
  } catch (error) {
    console.error("Koneksi database tidak berhasil: ", error);
  } finally {
    // Anda bisa menutup koneksi setelah pengecekan jika ini hanya untuk health check
    await prisma.$disconnect();
  }
}

// Hanya lakukan pengecekan jika di lingkungan development atau testing
if (process.env.NODE_ENV !== "production") {
  checkDatabaseConnection();
}

// Menangani sinyal untuk memastikan koneksi database ditutup dengan benar
async function gracefulShutdown() {
  try {
    await prisma.$disconnect();
    console.log("Koneksi database ditutup dengan aman.");
    process.exit(0);
  } catch (error) {
    console.error("Error saat menutup koneksi database:", error);
    process.exit(1);
  }
}

// Menangani berbagai jenis shutdown untuk memastikan koneksi Prisma ditutup dengan benar
process.on("SIGINT", gracefulShutdown); // CTRL+C
process.on("SIGTERM", gracefulShutdown); // Docker stop / shutdown dari server
process.on("exit", gracefulShutdown); // Keluaran normal

module.exports = prisma;
