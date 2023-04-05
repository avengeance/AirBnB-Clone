'use strict';

let options = {}
if (process.env.NODE_ENV === 'production') {
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
      },
      {
        userId: 2,
        spotId: 1,
        review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
       nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
       reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
       pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa 
       qui officia deserunt mollit anim id est laborum.`,
        stars: 3
      },
      {
        userId: 3,
        spotId: 1,
        review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
       nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
       reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
       pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa 
       qui officia deserunt mollit anim id est laborum.`,
        stars: 5
      },
      {
        userId: 1,
        spotId: 2,
        review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
       nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
       reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
       pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa 
       qui officia deserunt mollit anim id est laborum.`,
        stars: 3
      }, {
        userId: 2,
        spotId: 2,
        review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
       nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
       reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
       pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa 
       qui officia deserunt mollit anim id est laborum.`,
        stars: 2
      }, {
        userId: 3,
        spotId: 2,
        review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
       nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
       reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
       pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa 
       qui officia deserunt mollit anim id est laborum.`,
        stars: 1
      },
      {
        userId: 3,
        spotId: 3,
        review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
       nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
       reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
       pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa 
       qui officia deserunt mollit anim id est laborum.`,
        stars: 2
      }, {
        userId: 2,
        spotId: 3,
        review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
       nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
       reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
       pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa 
       qui officia deserunt mollit anim id est laborum.`,
        stars: 5
      }, {
        userId: 1,
        spotId: 3,
        review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
       nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
       reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
       pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa 
       qui officia deserunt mollit anim id est laborum.`,
        stars: 5
      },
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
