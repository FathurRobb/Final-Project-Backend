const { Op } = require('sequelize');
const db = require('../models');
const Service = db.services;

exports.create = async (req, res) => {
    const { name } = req.body;
    try {
        await Service.create({
            name,
        });

        return res.status(201).json({
            message: "Service added successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error
        });
    }
};

exports.update = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const existsService = await Service.findOne({
            where: {
                id
            },
        });

        if (existsService) {
            existsService.name = name;

            await existsService.save();
            return res.status(200).json({
                message: "Service has been edited"
            });
        } else {
            return res.status(404).json({
                message: "Service not found",
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
    const { id } = req.params;
    try {
        const existsService = await Service.findOne({
            where: {
                id
            },
        });

        if (existsService) {
            await existsService.destroy();
            return res.status(200).json({
                message: "Service has been deleted"
            });
        } else {
            return res.status(404).json({
                message: "Service not found",
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
        const limit = parseInt(req.query.limit) || await Service.count({});
        const search = req.query.searchQuery || "";
        const offset = limit * page;
        const totalRows = await Service.count({
            where: {
                [Op.or]: [{name:{
                    [Op.like]: '%'+search+'%'
                }}]
            }
        });
        const totalPage = Math.ceil(totalRows / limit);
        const services = await Service.findAll({
            where: {
                [Op.or]: [{name:{
                    [Op.like]: '%'+search+'%'
                }}]
            },
            offset,
            limit,
            order: [['id', 'DESC']]
        });

        return res.status(200).json({
            data: services,
            page,
            limit,
            totalRows,
            totalPage,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error
        });
    }
}
