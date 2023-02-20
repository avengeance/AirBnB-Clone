'use strict';

let options = {}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Bookings'
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        startDate: '2023, 01, 01',
        endDate: '2023, 01, 08',
      },
      {
        spotId: 2,
        userId: 2,
        startDate: '2023 ,02, 01',
        endDate: '2023, 02, 08',
      },
      {
        spotId: 3,
        userId: 3,
        startDate: '2023, 03, 01',
        endDate: '2023, 03, 08',
      }
    ])

  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings'
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {})
  }
};
