const express = require('express');
const asyncHandler = require('express-async-handler');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User, Spot, Image, Amenity } = require('../../db/models');
const router = express.Router();




router.get("/", asyncHandler(async (req, res) => {
    const spots = await Spot.findAll({
        include: [Image, Amenity, User]
    })
        // console.log('spots', spots)
    // console.log('with images', spots[0].Images[0].url)
    return res.json(spots)
}))

router.get('/:id', asyncHandler(async (req, res) => {
    const spotId = parseInt(req.params.id, 10)
    const spot = await Spot.findByPk(spotId, {
        include: [Image, Amenity, User]
    })
    // console.log('spots', spot.User['dataValues'].username)
    return res.json(spot)
}))

router.post('/host',

    requireAuth,
    asyncHandler(async (req, res) => {
       const { image, spots, amenities } = req.body
       const id = await Spot.create(spots)
       const newImageUrl = {
           spotId: id.id,
           url: image.url
       }
       await Image.create(newImageUrl)
       const newAmenityList = {
           spotId: id.id,
           kitchen: amenities.kitchen,
           boardGames: amenities.boardGames,
           fireplace: amenities.fireplace,
           parking: amenities.parking,
           wifi: amenities.wifi,
           hotTub: amenities.hotTub,
           pets: amenities.pets,
           BBQgrill: amenities.BBQgrill
       }
       await Amenity.create(newAmenityList)
       // await setTokenCookie(res, id);
       return res.json({
           id
       })
   }))

router.put('/:id/host',
requireAuth,
asyncHandler(async (req, res) => {
   const { image, spots, amenities } = req.body
   const id = await Spot.update(spots)
   const newImageUrl = {
       spotId: id.id,
       url: image.url
   }
   await Image.update(newImageUrl)
   const newAmenityList = {
       spotId: id.id,
       kitchen: amenities.kitchen,
       boardGames: amenities.boardGames,
       fireplace: amenities.fireplace,
       parking: amenities.parking,
       wifi: amenities.wifi,
       hotTub: amenities.hotTub,
       pets: amenities.pets,
       BBQgrill: amenities.BBQgrill
   }
   await Amenity.update(newAmenityList);
   return res.json({
       id
   })
}))


 requireAuth,
 asyncHandler(async (req, res) => {
    const id = await Spot.create(req.body['spot'])
    const newImageUrl = {
        url: req.body['image'].url,
        spotId: id.id
    }
    const newImage = await Image.create(newImageUrl)
    return res.json({id})
})

module.exports = router;
