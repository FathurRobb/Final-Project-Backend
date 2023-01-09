const { Op } = require('sequelize');
const db = require('../models');
const Category = db.categories;

exports.create = async (req, res) => {
    try {
        const { name } = req.body;
        
        await Category.create({
            name,
        });

        return res.status(201).json({
            message: "Category added successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error
        });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const existsCategory = await Category.findOne({
            where: {
                id
            },
        });

        if (existsCategory) {
            existsCategory.name = name;

            await existsCategory.save();
            return res.status(200).json({
                message: "Category has been edited"
            });
        } else {
            return res.status(404).json({
                message: "Category not found",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error
        });
    }
};

exports.destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const existsCategory = await Category.findOne({
            where: {
                id
            },
        });

        if (existsCategory) {
            await existsCategory.destroy();
            return res.status(200).json({
                message: "Category has been deleted"
            });
        } else {
            return res.status(404).json({
                message: "Category not found",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error
        });
    }
};

exports.getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || await Category.count({});
        const search = req.query.search_query || "";
        const offset = limit * page;
        const totalRows = await Category.count({
            where: {
                [Op.or]: [{name:{
                    [Op.like]: '%'+search+'%'
                }}]
            }
        });
        const totalPage = Math.ceil(totalRows / limit);
        const categories = await Category.findAll({
            where: {
                [Op.or]: [{name:{
                    [Op.like]: '%'+search+'%'
                }}]
            },
            offset: offset,
            limit: limit,
            order: [['id', 'DESC']]
        });

        return res.status(200).json({
            data: categories,
            page: page,
            limit: limit,
            totalRows: totalRows,
            totalPage: totalPage,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error
        });
    }
}