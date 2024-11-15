const { PrismaClient } = require ('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabaseConnection() {
    try {
        await prisma.$connect();
        console.log('Koneksi database berhasil.');
    } catch (error) {
        console.error('Koneksi database tidak berhasil: ', error);
    }
}

checkDatabaseConnection();

process.on('exit', async () => {
    await prisma.$disconnect();
});

module.exports= prisma;