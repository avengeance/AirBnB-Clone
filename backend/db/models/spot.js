'use strict';
const {
  Model, Sequelize
} = require('sequelize');

const { Review, ReviewImage } = require('../models/index.js')
let schema;
if (process.env.NODE_ENV === 'production') {
  schema = process.env.SCHEMA; // define your schema in opinos object
}

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(models.User, {
        foreignKey: "ownerId", as: "Owner",
        onDelete: "CASCADE",
        hooks: true
      })
      Spot.hasMany(models.SpotImage, { foreignKey: "spotId" })
      Spot.hasMany(models.Review, { foreignKey: 'spotId' })
      Spot.hasMany(models.Booking, { foreignKey: 'spotId' })
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
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isDecimal: {
          args: true,
          msg: 'Latitude is not Valid'
        },
        len: [1, 20],
        notEmpty: true
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isDecimal: {
          args: true,
          msg: 'Longitude is not Valid'
        },
        len: [1, 20],
        notEmpty: true
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 50]
      }
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
    scopes: {
      includePrevAvg(userId) {
        const { Review, SpotImage } = require('./index.js')
        return {
          where: { ownerId: userId },
          include: [
            { model: Review, attributes: [], },
            { model: SpotImage, attributes: [] },
          ],
          attributes: {
            include: [
              'id',
              'ownerId',
              [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating',],
              [Sequelize.col('SpotImages.url'), 'previewImage',]
            ],
          },
          group: ['Reviews.spotId', 'Spot.id', 'SpotImages.url', 'SpotImages.id', 'Owner.id'],
        }
      },
      queryFilter() {
        return {
          attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt',
            [Sequelize.literal(`(SELECT ROUND(AVG(stars), 1) FROM ${schema ? `"${schema}"."Reviews"` : 'Reviews'} WHERE "Reviews"."spotId" = "Spot"."id")`
            ),
              'avgRating',
            ],
            [
              Sequelize.literal(`(SELECT url FROM ${schema ? `"${schema}"."SpotImages"` : 'SpotImages'} WHERE "SpotImages"."spotId" = "Spot"."id" AND "SpotImages"."preview" = true LIMIT 1)`
              ),
              'previewImage',
            ],
          ],
        };
      }
    },
  });
  return Spot;
};
