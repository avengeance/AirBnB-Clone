'use strict';

let options = {}
if (process.enc.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Reviews'
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        spotId: 1,
        review: 'Lots of room, great place would reccommend',
        stars: 4
      },
      {
        userId: 2,
        spotId: 2,
        review: 'Great location to see the city lights',
        stars: 4
      },
      {
        userId: 3,
        spotId: 3,
        review: 'Very homely environment',
        stars: 4
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews'
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {})
  }
};
