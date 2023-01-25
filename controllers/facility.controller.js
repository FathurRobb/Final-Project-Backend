const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const db = require('../models');
const Facility = db.facilities;
const Service = db.services;

exports.create = async (req, res) => {
    const { name, type, image, description, telp, lat, long, city, country, maps, services } = req.body;
    let imageUrl;

    if (image) {
        const buff = new Buffer(image.split('base64,')[1], 'base64');
        const filename = +Date.now();
        const baseImage = { profilepic:image };
        const mimeType = baseImage.profilepic.match(/[^:/]\w+(?=;|,)/)[0];
        const dir = path.join(__dirname,"../assets/uploads/facilities/"+filename+'.'+mimeType);
        fs.writeFileSync(dir, buff)
        imageUrl = "/uploads/facilities/"+filename+'.'+mimeType;
    }

    await Facility.create({
        name, 
        type, 
        description, 
        telp, 
        lat, 
        long, 
        city, 
        country, 
        maps,
        image: imageUrl
    }).then(hf => {
        for (let i = 0; i < services.length; i++) {
            Service.findByPk(services[i],{
            }).then(hs => {
                hf.setServices(hs).then(() => {
                    return res.status(201).json({
                        message: "The facility have successfully created"
                    });
                })
            })
        }
    }).catch(err => {
        console.error(err)
        return res.status(500).json({
            message: "Something went wrong"
        });    
    })
};

exports.destroy = async (req, res) => {
    const { id } = req.params;
    try {
        const existsFacility = await Facility.findOne({
            where: {
                id
            },
        });

        if (existsFacility) {
            const oldFile = existsFacility.image.split('facilities/')[1];
            fs.unlink(path.join(__dirname,"../assets/uploads/facilities/")+oldFile, (err) => {
                if (err) {
                    res.status(500).send({
                        message: "Could not delete the file " + err,
                    });
                }
                console.log("Old file is deleted");
            });

            await existsFacility.destroy();
            return res.status(200).json({
                message: "The faciluty has been deleted",
            });
        } else {
            return res.status(404).json({
                message: "Facility not found",
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
        const limit = parseInt(req.query.limit) || await Facility.count({});
        const search = req.query.searchQuery || "";
        const type = req.query.type;
        const offset = limit * page;
        let query = {
            offset,
            limit,
            order: [['createdAt', 'DESC']],
            include: ['services']
        }
        
        if (search) {
            query.where = {
                [Op.or]: [{name:{
                    [Op.like]: '%'+search+'%'
                }}, {city:{
                    [Op.like]: '%'+search+'%'
                }}, {country:{
                    [Op.like]: '%'+search+'%'
                }}]
            }    
        }

        if (type) {
            query.where = [{'type': type}]
        }
        
        const totalRows = await Facility.count({
            where: {
                [Op.or]: [{name:{
                    [Op.like]: '%'+search+'%'
                }}, {city:{
                    [Op.like]: '%'+search+'%'
                }}, {country:{
                    [Op.like]: '%'+search+'%'
                }}]
            }
        });
        const totalPage = Math.ceil(totalRows / limit);
        const facilities = await Facility.findAll(query);
        
        return res.status(200).json({
            data: facilities,
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