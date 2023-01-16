const { Op } = require('sequelize');
const db = require('../models');
const Post = db.posts;
const Archive = db.archives;

exports.actionArchived = async (req, res) => {
    const { userId, postId } = req.body;
    try {
        const post = await Post.findByPk(postId)

        if (post) {
            const existsArchive = await Archive.findOne({
                where: {
                    userId,
                    postId
                }
            });

            if (existsArchive) {
                await existsArchive.destroy();
                res.status(200).send({
                    message: "The article is no longer archived"
                })
            } else {
                await Archive.create({
                    userId,
                    postId
                });
    
                return res.status(201).json({
                    message: 'The article has been archived'
                });
            }
        } else {
            return res.status(404).json({
                message: "Post not found",
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error
        });
    }
};

exports.getArchived = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || await Archive.count({});
        const search = req.query.searchQuery || "";
        const offset = limit * page;
        const totalRows = await Archive.count({
            where: {
                [Op.or]: [{'$post.title$':{
                    [Op.like]: '%'+search+'%'
                }},{'$post.content$':{
                    [Op.like]: '%'+search+'%'
                }},]
            },
            include: ['post']
        });
        const totalPage = Math.ceil(totalRows / limit);
        const archives = await Archive.findAll({
            where: {
                [Op.or]: [{'$post.title$':{
                    [Op.like]: '%'+search+'%'
                }},{'$post.content$':{
                    [Op.like]: '%'+search+'%'
                }},]
            },
            offset,
            limit,
            order: [['createdAt', 'DESC']],
            include: ['post']
        });

        return res.status(200).json({
            data: archives,
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