'use strict';

let options = {}
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages'
    return queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: 'https://images.pexels.com/photos/53610/large-home-residential-house-architecture-53610.jpeg'
      },
      {
        reviewId: 2,
        url: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      },
      {
        reviewId: 3,
        url: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      },
      {
        reviewId: 1,
        url: 'https://www.pexels.com/photo/blooming-bush-near-aged-cottage-in-countryside-4394220/'
      },
      {
        reviewId: 1,
        url: 'https://www.pexels.com/photo/bedroom-interior-with-vases-with-branch-near-bed-and-mirror-6480209/'
      },
      {
        reviewId: 1,
        url: `https://www.pexels.com/photo/well-lit-bathroom-in-old-fashioned-interior-3951742/`
      },
      {
        reviewId: 2,
        url: 'https://www.pexels.com/photo/kitchen-island-and-barstools-534151/'
      },
      {
        reviewId: 2,
        url: 'https://www.pexels.com/photo/stylish-living-room-in-light-apartment-5998120/'
      },
      {
        reviewId: 2,
        url: 'https://www.pexels.com/photo/retro-fashioned-cabinet-with-elegant-lamps-in-cozy-flat-5824530/'
      },
      {
        reviewId: 3,
        url: 'https://www.pexels.com/photo/kitchen-with-furniture-and-appliances-2724748/'
      },
      {
        reviewId: 3,
        url: 'https://www.pexels.com/photo/spacious-lounge-room-with-soft-furniture-5998138/'
      },
      {
        reviewId: 3,
        url: 'https://www.pexels.com/photo/bedroom-interior-with-table-next-to-bed-6636252/'
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
