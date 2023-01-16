const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const db = require('../models');
const Post = db.posts;

exports.create = async (req, res) => {
    const { userId, categoryId, title, image, content } = req.body;
    let imageUrl;
    try {
        if (image) {
            const buff = new Buffer(image.split('base64,')[1], 'base64');
            const filename = userId.toString()+Date.now();
            const baseImage = {profilepic:image};
            const mimeType = baseImage.profilepic.match(/[^:/]\w+(?=;|,)/)[0];
            const dir = path.join(__dirname,"../assets/uploads/posts/"+filename+'.'+mimeType);
            fs.writeFileSync(dir, buff)
            imageUrl = "/uploads/posts/"+filename+'.'+mimeType;
        }

        await Post.create({
            userId,
            categoryId,
            title,
            image: imageUrl,
            content
        });

        return res.status(201).json({
            message: "Your post have successfully created"
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
    const { userId, categoryId, title, image, content } = req.body;
    try {
        const existsPost = await Post.findOne({
            where: {
                id,
                userId
            },
        });

        if (existsPost) {
            existsPost.categoryId = categoryId;
            existsPost.title = title;
            existsPost.content = content;
            if (image) {
                const oldFile = existsPost.image.split('posts/')[1];
                const buff = new Buffer(image.split('base64,')[1], 'base64');
                const filename = userId.toString()+Date.now();
                const baseImage = {profilepic:image};
                const mimeType = baseImage.profilepic.match(/[^:/]\w+(?=;|,)/)[0];
                const dir = path.join(__dirname,"../assets/uploads/posts/"+filename+'.'+mimeType);
                fs.writeFileSync(dir, buff);
                existsPost.image = "/uploads/posts/"+filename+'.'+mimeType;
                fs.unlink(path.join(__dirname,"../assets/uploads/posts")+oldFile, (err) => {
                    if (err) {
                        res.status(500).send({
                            message: "Could not delete the file " + err,
                        });
                    }
                    console.log("Old file is deleted");
                });
            }
            await existsPost.save();
            return res.status(200).json({
                message: "Your post has been edited",
            });
        } else {
            return res.status(404).json({
                message: "Post not found or this is not your post",
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
        const existsPost = await Post.findOne({
            where: {
                id
            },
        });

        if (existsPost) {
            const oldFile = existsPost.image.split('posts/')[1];
            fs.unlink(path.join(__dirname,"../assets/uploads/posts/")+oldFile, (err) => {
                if (err) {
                    res.status(500).send({
                        message: "Could not delete the file " + err,
                    });
                }
                console.log("Old file is deleted");
            });

            await existsPost.destroy();
            return res.status(200).json({
                message: "Your post has been deleted",
            });
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

exports.getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || await Post.count({});
        const search = req.query.searchQuery || "";
        const category_id = req.query.categoryId;
        const user_id = req.query.userId;
        const offset = limit * page;
        let query = {
            offset,
            limit,
            order: [['createdAt', 'DESC']]
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

        if (user_id) {
            query.where = [{'userId': user_id}]
        }
        
        const totalRows = await Post.count({
            where: {
                [Op.or]: [{title:{
                    [Op.like]: '%'+search+'%'
                }}, {content:{
                    [Op.like]: '%'+search+'%'
                }}]
            }
        });
        const totalPage = Math.ceil(totalRows / limit);
        const posts = await Post.findAll(query);
        
        return res.status(200).json({
            data: posts,
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
        const data = await Post.findByPk(id, {
            include: { all: true, nested: true },
        });

        if (data) {
            return res.status(200).json({
                data
            });
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
}