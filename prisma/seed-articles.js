

// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const articles = require('./data/articles');
const prisma = new PrismaClient();

async function cleanDatabase() {
    console.log('Cleaning database...');
    await prisma.articles.deleteMany({});
    console.log('Database cleaned');
}

async function seedArticles() {
    console.log('Starting to seed articles...');
    
    for (const article of articles) {
        try {
            await prisma.articles.create({
                data: article
            });
            console.log(`Created article: ${article.title}`);
        } catch (error) {
            console.error(`Error creating article ${article.title}:`, error);
            throw error;
        }
    }
    
    console.log('Articles seeding completed');
}

async function main() {
    try {
        await cleanDatabase();
        await seedArticles();
        
        const articleCount = await prisma.articles.count();
        console.log(`Successfully seeded ${articleCount} articles`);
    } catch (error) {
        console.error('Error in seed process:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

