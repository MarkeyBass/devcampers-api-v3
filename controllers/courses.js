const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");

// @desc      Get all Courses
// @rout      Get /api/v1/courses
// @rout      Get /api/v1/:bootcampId/courses
// @access    Public
exports.getCourses = asyncHandler(
  // {{URL}}/api/v1/courses?select=title&limit=2
  // {{URL}}/api/v1/courses?select=title&page=4&limit=2
  async (req, res, next) => {
    if (req.params.bootcampId) {
      course = await Course.find({
        bootcamp: req.params.bootcampId,
      });

      return res
        .status(200)
        .json({
          success: true,
          count: courses.length,
          data: course,
        });
    } else {
      res.status(200).json(res.advancedResults);
    }
  }
);

// @desc      Get single course
// @rout      Get /api/v1/courses/:id
// @access    Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(
    req.params.id
  ).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course) {
    return next(
      new ErrorResponse(
        `No course with the id of ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc      Add course
// @rout      Get /api/v1/bootcamps/:bootcampId/courses
// @access    Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  // Manually assignings bootcamp as a body field
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(
    req.body.bootcamp
  );

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp with the id of ${req.params.id}`,
        404
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    msg: `New course ${course._id} was created.`,
    data: course,
  });
});

// @desc      Update course
// @rout      PUT /api/v1/courses/:id
// @access    Private
exports.updateCourse = asyncHandler(
  async (req, res, next) => {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return next(
        new ErrorResponse(
          `No course with the id of ${req.params.id}`,
          404
        )
      );
    }

    course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(201).json({
      success: true,
      msg: `New course ${course._id} was updated.`,
      data: course,
    });
  }
);

// @desc      Update course
// @rout      PUT /api/v1/courses/:id
// @access    Private
exports.deleteCourse = asyncHandler(
  async (req, res, next) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return next(
        new ErrorResponse(
          `No course with the id of ${req.params.id}`,
          404
        )
      );
    }

    // course = await Course.findByIdAndDelete(req.params.id);
    await course.remove();

    res.status(201).json({
      success: true,
      msg: `Course ${course._id} was deleted.`,
      data: {},
    });
  }
);
