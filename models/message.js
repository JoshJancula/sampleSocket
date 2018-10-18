module.exports = function (sequelize, DataTypes) {
    var TestMessage = sequelize.define("TestMessage", {

        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Author: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        Recipient: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        Content: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            unique: false,
            allowNull: false,
        }
    });

    return TestMessage;
};