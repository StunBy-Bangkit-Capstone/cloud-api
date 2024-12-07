// src/controllers/artikel.controller.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Menambahkan artikel
const addArtikel = async (req, res) => {
    try {
        const { title, constent, author, article_img_url } = req.body;
        const artikel = await prisma.articles.create({
            data: {
                title,
                constent,
                author,
                article_img_url,
            },
        });
        res.status(201).json({ message: 'Artikel created successfully', data: artikel });
    } catch (error) {
        console.error('Error adding artikel:', error);
        res.status(500).json({ error: error.message });
    }
};

// Mendapatkan semua artikel
const getArtikels = async (req, res) => {
    try {
        const artikels = await prisma.articles.findMany();
        res.status(200).json(artikels);
    } catch (error) {
        console.error('Error fetching artikels:', error);
        res.status(500).json({ error: error.message });
    }
};

// Mendapatkan artikel berdasarkan ID
const getArtikelDetail = async (req, res) => {
    try {
        const artikelId = req.params.id; // Pastikan ID yang diberikan adalah string

        // Mengambil artikel berdasarkan ID (UUID)
        const artikel = await prisma.articles.findUnique({
            where: {
                id: artikelId, // ID harus berupa string
            },
        });

        if (!artikel) {
            return res.status(404).json({ message: 'Artikel not found' });
        }

        res.status(200).json({ data: artikel });
    } catch (error) {
        console.error('Error getting artikel detail:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addArtikel, getArtikels, getArtikelDetail };
