const path = require('path');
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require("../models/Bootcamp");
const dotenv = require('dotenv');
dotenv.config({ path: '../config/config.env' });

// @desc      Get all bootcamps
// @rout      Get /api/v1/bootcamps
// @access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {



    res.status(200).json(res.advancedResults);

    // res.status(200).json({
    //   success: true,
    //   count: bootcamps.length,
    //   data: bootcamps,
    //   pagination
    // });
});

// @desc      Get single bootcamp
// @rout      GET /api/v1/bootcamps/:id
// @access    Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return next(new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`, 404));

    }

    res.status(200).json({
      success: true,
      msg: `Single ${req.params.id} bootcamp is displayed`,
      data: bootcamp,
    });

});

// @desc      Create new bootcamp
// @rout      POST /api/v1/bootcamps
// @access    Privat
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      msg: `New bootcamp ${bootcamp._id} was created.`,
      data: bootcamp,
    });
});

// @desc      Update bootcamp
// @rout      PUT /api/v1/bootcamps/:id
// @access    Privat
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    console.log({ bootcamp });
    if (!bootcamp) {
      return next(new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`, 404));

    }
    res.status(200).json({
      success: true,
      data: bootcamp,
      msg: `Update bootcamp ${req.params.id}`,
    });
});

// @desc      Delete bootcamp
// @rout      DELETE /api/v1/bootcamps/:id
// @access    Privat
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return next(new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`, 404));
    }

    await bootcamp.remove()

    res.status(200).json({
      success: true,
      msg: `bootcamp ${req.params.id} was deleted`,
      data: {},
    });
});


// @desc      Get bootcamp within a radius (In Miles)
// @rout      GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Privat
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params; // distance in Miles

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide distance by radius of Earth
  // Earth Radius = 3,963 miles / 6,378.1 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [ [ lng, lat ], radius ] }
    }
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});

// @desc      Upload photo for bootcamp 
// @rout      PUT /api/v1/bootcamps/:id/photo
// @access    Privat
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`, 404));
  }

  if(!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure that the image is a photo
  if(!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if(file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse(`You can upload an image with max size of ${process.env.MAX_FILE_UPLOAD} bites`, 400));
  }

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if(err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    };

    await Bootcamp.findOneAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({
      success: true,
      data: file.name
    })
    
  });

  // console.log(file.name);
});
