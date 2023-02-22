'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(models.User, { foreignKey: 'userId' })
      Review.belongsTo(models.Spot, { foreignKey: 'spotId' })
      Review.hasMany(models.ReviewImage, { foreignKey: 'reviewId' })
    }
  }
  Review.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Review',
    scopes: {
      includeUserSpotReviewImages(userId) {
        const { User, Spot, ReviewImage, SpotImage } = require('./index.js')
        return {
          where: { userId: userId },
          include: [
            { model: User, attributes: ['id', 'firstName', 'lastName'] },
            {
              model: Spot, attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country',
                'lat', 'lng', 'name', 'price'],
              include: [{ model: SpotImage, attributes: ['url'] }],
            },
            { model: ReviewImage, attributes: ['id', 'url'] },
            // { model: SpotImage, attributes: ['id,', 'url', 'preview'] }
          ]
          // group: 'Reviews.spotId',
        }
      }
    }
  });
  return Review;
};
// [Sequelize.col('url'), 'previewImage',]
