'use strict';

let options = {}
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

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
        spotId: 1,
        url: 'https://images.pexels.com/photos/6527069/pexels-photo-6527069.jpeg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://images.pexels.com/photos/4846106/pexels-photo-4846106.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://images.pexels.com/photos/5824519/pexels-photo-5824519.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://images.pexels.com/photos/6032416/pexels-photo-6032416.jpeg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://images.pexels.com/photos/5997992/pexels-photo-5997992.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        preview: true
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
