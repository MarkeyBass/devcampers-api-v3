const advancedResults = (model, populate) => async (req, res, next) => {
  // URL EXAMPLES
  // -------------
  // {{URL}}/api/v1/bootcamps?location.state=MA&housing=true
  // {{URL}}/api/v1/bootcamps?averageCost[lte]=1000
  // {{URL}}/api/v1/bootcamps?averageCost[gt]=8000&location.city=Boston
  // {{URL}}/api/v1/bootcamps?careers[in]=Data Science
  // {{URL}}/api/v1/bootcamps?select=name,description
  // {{URL}}/api/v1/bootcamps?select=name,description&housing=true
  // {{URL}}/api/v1/bootcamps?select=name,description,createdAt&sort=name
  // {{URL}}/api/v1/bootcamps?select=name,description,createdAt&sort=-name
  
    // console.log(req.query);
    let query;

    // Copy req.query 
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operatiors ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // console.log(queryStr)

    // Finding resource                      
    query = model.find(JSON.parse(queryStr))


    // Reverse populating - mooved to the route file.
    // .populate({path: 'courses'});

    // Select Fields
    if(req.query.select) {
      const fields = req.query.select.split(',').join(' ')
      query = query.select(fields);
    }

    // Sort
    if(req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt')
    }

    // PAGINATION (page, limit)
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();
    
    // poulate
    if(populate) {
      query = query.populate(populate)
    };

    // Executing result
    query = query.skip(startIndex).limit(limit);

    // Pagination result
    const pagination = {};


    if(endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      }
    }

    if(startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      }
    }

    // Executing query
    const results = await query;
    
    res.advancedResults = {
      success: true,
      count: results.length,
      pagination,
      data: results
    }

    next();

};

  
module.exports = advancedResults