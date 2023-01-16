const { Op } = require('sequelize');
const db = require('../models');
const Question = db.questions;

exports.create = async (req, res) => {
    const { categoryId, userId, title, content } = req.body;
    try {
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
    const { id } = req.params;
    const { categoryId, userId, title, content } = req.body;
    try {
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
    const { id } = req.params;
    try {
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
        const search = req.query.searchQuery || "";
        const category_id = req.query.categoryId;
        const offset = limit * page;
        let query = {
            offset,
            limit,
            order: [['createdAt', 'DESC']],
            include: ['user','answers']
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
        const data = questions.map(q => ({
            id: q.id,
            categoryId: q.categoryId,
            userId: q.userId,
            fullName: q.user.first_name+" "+q.user.last_name,
            title: q.title,
            content: q.content,
            answers: q.answers.length,
            createdAt: q.createdAt,
            updatedAt: q.updatedAt
        }));
        
        return res.status(200).json({
            data,
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
};

exports.getById = async (req, res) => {
    const { id } = req.params;
    try {
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