const { Op } = require("sequelize");
const db = require("../models");
const Bcrypt = require("bcryptjs");
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
        User.create(userData)
          .then((user) => {
            res.json({ status: user.email + " registered!" });
          })
          .catch((err) => {
            res.send("error: " + err);
          });
      } else {
        res.json({ error: "User already exists" });
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
              });
            }
          );
        } else {
          res.status(400).json({ error: "Invalid password" });
        }
      } else {
        res.status(400).json({ error: "User does not exist" });
      }
    })
    .catch((err) => {
      res.status(400).json({ error: err });
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
              id
          },
      });

      if (existsRole) {
          existsRole.role_name = role_name;

          await existsRole.save();
          return res.status(200).json({
              message: "Role has been edited"
          });
      } else {
          return res.status(404).json({
              message: "Role not found",
          });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          message: error
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
