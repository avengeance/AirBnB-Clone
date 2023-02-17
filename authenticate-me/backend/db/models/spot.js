'use strict';
const {
  Model, Sequelize
} = require('sequelize');

const { Review } = require('../models/index.js')

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(models.User, { foreignKey: "ownerId" })
      Spot.hasMany(models.SpotImage, { foreignKey: "spotId" })
      Spot.hasMany(models.Review, { foreignKey: 'spotId' })
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lng: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Spot',
    defaultScope: {
      include: [
        {
          models: Review,
          attributes: [
            [Sequelize.fn('AVG', sequelize.col('Review.stars')), 'avgReview']
          ]
        }

      ]
    },
    scopes: {
      previewImage(reviewId) {
        return {
          where: { reviewId }
        }
      }
    }
  });
  return Spot;
};
