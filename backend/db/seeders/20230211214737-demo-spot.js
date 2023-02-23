'use strict';

let options = {}
if (process.enc.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Spots'
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '123 fake st',
        city: 'Los Angeles',
        state: 'California',
        country: 'United States',
        lat: 34.052235,
        lng: -118.243683,
        name: 'Mansion',
        description: 'A big mansion',
        price: 500,
      }, {
        ownerId: 2,
        address: '345 false cir',
        city: 'New York',
        state: 'New York',
        country: 'United States',
        lat: 40.71276,
        lng: -74.005974,
        name: 'Medium sized house',
        description: 'A nice house in the big city',
        price: 250,
      }, {
        ownerId: 3,
        address: '987 invalid ave',
        city: 'Austin',
        state: 'Texas',
        country: 'United States',
        lat: 30.267153,
        lng: -97.743057,
        name: 'Small house',
        description: 'A small house to gather and explore the city',
        price: 125,
      },
      {
        ownerId: 1,
        address: '123 fake st1',
        city: 'Los Angeles1',
        state: 'California1',
        country: 'United States1',
        lat: 34.052235,
        lng: -118.243683,
        name: 'Mansion1',
        description: 'A big mansion1',
        price: 500,
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots'
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1, 2, 3] }
    }, {})
  }
};
