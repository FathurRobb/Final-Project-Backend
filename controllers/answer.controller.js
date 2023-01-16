const db = require('../models');
const Question = db.questions;
const Answer = db.answers;

exports.create = async (req, res) => {
    const { questionId } = req.params
    const { userId, content } = req.body;
    try {
        const existsQuestion = await Question.findOne({
            where: {
                id: questionId
            },
        });

        if (existsQuestion) {    
            await Answer.create({
                questionId,
                userId,
                content
            });

            return res.status(201).json({
                message: "Answer created successfully"
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

exports.update = async (req, res) => {
    const { id } = req.params;
    const { questionId, userId, content } = req.body;
    try {
        const existsAnswer = await Answer.findOne({
            where: {
                id
            },
        });

        if (existsAnswer) {
            existsAnswer.questionId = questionId;
            existsAnswer.userId = userId;
            existsAnswer.content = content;

            await existsAnswer.save();

            return res.status(200).json({
                message: "Answer has been edited"
            });   
        } else {
            return res.status(404).json({
                message: "Answer not found",
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
        const existsAnswer = await Answer.findOne({
            where: {
                id
            },
        });

        if (existsAnswer) {
            await existsAnswer.destroy();
    
            return res.status(200).json({
                message: "Answer has been deleted"
            });  
        } else {
            return res.status(404).json({
                message: "Answer not found",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error
        });
    }
};