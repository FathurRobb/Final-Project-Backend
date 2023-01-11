module.exports = (sequelize, Sequelize) => {
  const Comments = sequelize.define("comments", {
    commentId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    postId: {
      type: Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.INTEGER,
    },
    comment: {
      type: Sequelize.STRING,
    },
  });

  return Comments;
};
