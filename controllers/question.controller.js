const { Op } = require('sequelize');
const db = require('../models');
const Question = db.questions;

exports.create = async (req, res) => {
    try {
        const { categoryId, userId, title, content } = req.body;

        await Question.create({
            categoryId,
            userId,
            title,
            content
        });

        return res.status(201).json({
            message: "Question created successfully"
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
        const { categoryId, userId, title, content } = req.body;

        const existsQuestion = await Question.findOne({
            where: {
                id
            },
        });

        if (existsQuestion) {
            if (existsQuestion.userId === userId) {
                existsQuestion.categoryId = categoryId;
                existsQuestion.title = title;
                existsQuestion.content = content;

                await existsQuestion.save();
    
                return res.status(200).json({
                    message: "Question has been edited"
                });                
            } else {
                return res.status(401).json({
                    message: "This is not your question",
                });    
            }
        } else {
            return res.status(404).json({
                message: "Question not found",
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

        const existsQuestion = await Question.findOne({
            where: {
                id
            },
        });

        if (existsQuestion) {
            await existsQuestion.destroy();
    
            return res.status(200).json({
                message: "Question has been deleted"
            });  
        } else {
            return res.status(404).json({
                message: "Question not found",
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
        const limit = parseInt(req.query.limit) || await Question.count({});
        const search = req.query.search_query || "";
        const category_id = req.query.categoryId;
        const offset = limit * page;
        let query = {
            offset: offset,
            limit: limit,
            order: [['createdAt', 'DESC']],
            include: ['user']
        }
        
        if (search) {
            query.where = {
                [Op.or]: [{title:{
                    [Op.like]: '%'+search+'%'
                }}, {content:{
                    [Op.like]: '%'+search+'%'
                }}]
            }    
        }

        if (category_id) {
            query.where = [{'categoryId': category_id}]
        }
        
        const totalRows = await Question.count({
            where: {
                [Op.or]: [{title:{
                    [Op.like]: '%'+search+'%'
                }}, {content:{
                    [Op.like]: '%'+search+'%'
                }}]
            }
        });
        const totalPage = Math.ceil(totalRows / limit);
        const questions = await Question.findAll(query);
        
        return res.status(200).json({
            data: questions,
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
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Question.findByPk(id, {
            include: { all: true, nested: true }
        });

        if (data) {
            return res.status(200).json({
                data
            });
        } else {
            return res.status(404).json({
                message: "Question not found",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error
        });
    }
};