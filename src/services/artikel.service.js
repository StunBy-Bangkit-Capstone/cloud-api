const Artikel = require('../models/artikel.model.js');

const addArtikel = async (data) => {
    try {
        const artikel = await Artikel.create(data);
        return artikel;
    } catch (error) {
        throw new Error('Failed to add artikel: ' + error.message);
    }
};

const getAllArtikels = async () => {
    try {
        const artikels = await Artikel.findAll();
        return artikels;
    } catch (error) {
        throw new Error('Failed to get artikels: ' + error.message);
    }
};

// Get artikel by ID
const getArtikelById = async (id) => {
    try {
        const artikel = await Artikel.findByPk(id);
        return artikel;
    } catch (error) {
        throw new Error('Failed to get artikel: ' + error.message);
    }
};

module.exports = {
    addArtikel,
    getAllArtikels,
    getArtikelById,
};
