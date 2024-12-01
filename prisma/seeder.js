const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    try {
        const users = [
            {
                email: "naufal@example.com",
                password: "@Test123", 
            },
            {
                email: "naufalse@example.com",
                password: "@Test123",
            },
            {
                email: "nopal@example.com",
                password: "@Test123",
            },
        ];

        for (const user of users) {
            await prisma.user.create({
                data: {
                    email: user.email,
                    password: user.password,
                },
            });
        }

        console.log("Seeding selesai!");
    } catch (error) {
        console.error("Error saat seeding:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
