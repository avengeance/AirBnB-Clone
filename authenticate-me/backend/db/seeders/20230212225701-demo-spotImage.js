'use strict';

let options = {}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'SpotImages'
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://images.pexels.com/photos/53610/large-home-residential-house-architecture-53610.jpeg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        preview: false
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
