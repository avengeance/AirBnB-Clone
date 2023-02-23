const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, Booking, ReviewImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { QueryInterface, Sequelize, Op } = require('sequelize');

const router = express.Router();

// Delete a Spot Image
router.delete('/:imageId', requireAuth, async (req, res) => {
    const imageId = req.params.imageId
    const image = await SpotImage.findByPk(imageId)
    if(!image){
        return res.status(404).json({
            "message":"Spot Image couldn't be found",
            "statusCode":404
        })
    }
    await image.destroy(imageId)
    return res.status(200).json({
        "message":"Successfully deleted",
        "statusCode":200
    })
})

module.exports = router;
