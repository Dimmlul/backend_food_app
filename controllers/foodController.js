const Food = require('../models/Food');

module.exports = {
    addFood: async (req, res) => {
        const { title, foodTags, category, code, restaurant, description, time, price, additives, imageUrl } = req.body;

        if (!title || !foodTags || !category || !code || !restaurant || !description || !time || !price || !additives || !imageUrl) {
            return res.status(400).json({ status: false, message: "You have a missing field" });
        }

        try {
            const newFood = new Food(req.body);
            await newFood.save();
            res.status(201).json({ status: true, message: "Food has been successfully added" });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    getFoodById: async (req, res) => {
        const id = req.params.id;
        try {
            const food = await Food.findById(id);
            if (!food) {
                return res.status(404).json({ status: false, message: "Food not found" });
            }
            res.status(200).json(food);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    getRandomFood: async (req, res) => {
        try {
            const randomFoodList = req.params.code
                ? await Food.aggregate([
                    { $match: { code: req.params.code } },
                    { $sample: { size: 3 } },
                    { $project: { __v: 0 } }
                ])
                : await Food.aggregate([
                    { $sample: { size: 5 } },
                    { $project: { __v: 0 } }
                ]);

            if (randomFoodList.length === 0) {
                return res.status(404).json({ status: false, message: 'No Foods found' });
            }

            res.status(200).json(randomFoodList);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    getFoodsByRestaurant: async (req, res) => {
        const id = req.params.id;
        try {
            const foods = await Food.find({ restaurant: id });
            if (foods.length === 0) {
                return res.status(404).json({ status: false, message: "No foods found for this restaurant" });
            }
            res.status(200).json(foods);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    getFoodsByCategoryAndCode: async (req, res) => {
        const { category, code } = req.params;
        try {
            const foods = await Food.aggregate([
                { $match: { category: category, code: code, isAvailable: true } },
                { $project: { __v: 0 } }
            ]);

            if (foods.length === 0) {
                return res.status(404).json({ status: false, message: "No foods found for this category and code" });
            }

            res.status(200).json(foods);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    searchFoods: async (req, res) => {
        const search = req.params.search.toLowerCase(); // Convert search term to lowercase
    
        try {
            const results = await Food.aggregate([
                {
                    $match: {
                        $or: [
                            { category: { $regex: search, $options: 'i' } }, // Match category
                            { foodTags: { $elemMatch: { $regex: search, $options: 'i' } } }, // Match foodTags array
                        ]
                    }
                }
            ]);
    
            res.status(200).json(results);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },
    

    getRandomFoodsByCategoryAndCode: async (req, res) => {
        const { category, code } = req.params;
        try {
            let foods = await Food.aggregate([
                { $match: { category: category, code: code, isAvailable: true } },
                { $sample: { size: 10 } }
            ]);

            if (!foods || foods.length === 0) {
                foods = await Food.aggregate([
                    { $match: { code: code, isAvailable: true } },
                    { $sample: { size: 10 } }
                ]);
            }

            if (!foods || foods.length === 0) {
                foods = await Food.aggregate([
                    { $match: { isAvailable: true } },
                    { $sample: { size: 10 } }
                ]);
            }

            res.status(200).json(foods);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    }
};
