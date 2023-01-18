const { Op } = require("sequelize");
const db = require("../models");
const Bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const User = db.users;
const Role = db.roles;

const JWT_SECRET_KEY = "finalprojectteam4";

exports.signup = async (req, res) => {
  const userData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
  };

  User.findOne({ where: { email: userData.email } })
    .then((user) => {
      if (!user) {
        const hash = Bcrypt.hashSync(userData.password, 10);
        const email = userData.email.split("@")[1];

        switch (email) {
          case "admin.healthhub.com":
            userData.roleId = 1;
            break;
          case "editor.healthhub.com":
            userData.roleId = 2;
            break;
          case "doctor.healthhub.com":
            userData.roleId = 3;
            break;
          default:
            userData.roleId = 4;
            break;
        }

        userData.password = hash;
        userData.image = "";
        User.create(userData)
          .then((user) => {
            res.json({ status: user.email + " registered!" });
          })
          .catch((err) => {
            res.send("error: " + err);
          });
      } else {
        res.status(400).json({ message: "User already exists" });
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
};

exports.login = async (req, res) => {
  User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (user) {
        if (Bcrypt.compareSync(req.body.password, user.password)) {
          const token = jwt.sign(user.dataValues, JWT_SECRET_KEY, {
            expiresIn: "2 days",
          });
          Role.findOne({ where: { id: user.dataValues.roleId } }).then(
            (role) => {
              res.json({
                id: user.dataValues.id,
                first_name: user.dataValues.first_name,
                last_name: user.dataValues.last_name,
                email: user.dataValues.email,
                token: token,
                role: role.dataValues.role_name,
                image: user.dataValues.image,
              });
            }
          );
        } else {
          res.status(400).json({ message: "Email or password is incorrect" });
        }
      } else {
        res.status(400).json({ message: "User does not exist" });
      }
    })
    .catch((err) => {
      res.status(400).json({ message: "Something went wrong" });
    });
};

exports.getUserInfo = async (req, res) => {
  const { id } = req.params;

  User.findOne({ where: { id: id } })
    .then((user) => {
      if (user) {
        Role.findOne({ where: { id: user.dataValues.roleId } }).then(
          (role) => {
            res.json({
              id: user.dataValues.id,
              first_name: user.dataValues.first_name,
              last_name: user.dataValues.last_name,
              email: user.dataValues.email,
              role: role.dataValues.role_name,
              image: user.dataValues.image,
            });
          }
        );
      } else {
        res.status(400).json({ message: "User does not exist" });
      }
    })
    .catch((err) => {
      res.status(400).json({ message: "Something went wrong" });
    });
};


exports.addRole = async (req, res) => {
  const roleData = {
    role_name: req.body.role_name,
  };

  Role.findOne({ where: { role_name: roleData.role_name } })
    .then((role) => {
      if (!role) {
        Role.create(roleData)
          .then((role) => {
            res.json({ status: role.role_name + " inserted!" });
          })
          .catch((err) => {
            res.send("error: " + err);
          });
      } else {
        res.json({ error: "Role already exists" });
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
};

exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_name } = req.body;

    const existsRole = await Role.findOne({
      where: {
        id,
      },
    });

    if (existsRole) {
      existsRole.role_name = role_name;

      await existsRole.save();
      return res.status(200).json({
        message: "Role has been edited",
      });
    } else {
      return res.status(404).json({
        message: "Role not found",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error,
    });
  }
};

exports.getRole = async (req, res) => {
  Role.findAll()
    .then((roles) => {
      res.json(roles);
    })
    .catch((err) => {
      res.send("error: " + err);
    });
};

exports.deleteUser = async (req, res) => {
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((user) => {
      res.json({ status: "User deleted!" });
    })
    .catch((err) => {
      res.send("error: " + err);
    });
};

exports.addImage = async (req, res) => {
  const { id } = req.params;
  const { image } = req.body;
  let imageUrl;
  try {
    User.findOne({ where: { id: id } }).then((user) => {
      if (user) {
        if (image) {
          const buff = new Buffer(image.split('base64,')[1], 'base64');
          const filename = user.dataValues.id + "_" + Date.now();
          const baseImage = { profilepic: image };
          const mimeType = baseImage.profilepic.match(/[^:/]\w+(?=;|,)/)[0];
          const dir = path.join(
            __dirname,
            "../assets/uploads/users/" + filename + "." + mimeType
          );
          fs.writeFileSync(dir, buff);
          imageUrl = "/uploads/users/" + filename + "." + mimeType;
        }

        user.image = imageUrl;
        user.save();
        res.json({ status: "Image added!" });
      } else {
        res.status(400).json({ message: "User does not exist" });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error,
    });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    const existsUser = await User.findOne({
      where: {
        id,
      },
    });

    if (existsUser) {
      existsUser.image = "";

      await existsUser.save();
      return res.status(200).json({
        message: "Image has been deleted",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error,
    });
  }
};
