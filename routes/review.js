// const express = require ("express");
// const router = express.Router({ mergeParams: true });
// const wrapAsyns = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const {  reviewSchema } = require("../schema.js");
// const Review = require("../models/review.js"); 
// const Listing = require("../models/listing.js");

// const validateReview = (req, res, next) => {
//     let { error }  = reviewSchema.validate(req.body);
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }  
// }; 
// //Reviews
// //Post Route
// router.post("/", 
//      validateReview,
//       wrapAsyns(async (req, res) => {
//         console.log(req.params.id);        
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);
    
//     listing.reviews.push(newReview);  
  
//     await newReview.save();
//     await listing.save();
    
//     //console.log("new review saved");
//     //console.log("new review saved");
//     req.flash("success", "New Review Created!");
//     res.redirect(`/listings/${listing._id}`);
//   }));
  
//   //delete Review Route
//  router.delete(
//       "/:reviewId",
//       wrapAsyns(async (req, res) => {
//           let {id, reviewId} = req.params;
  
//           await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
//           await Review.findByIdAndDelete(reviewId);
//           req.flash("success", "New Review Delete!");
//           res.redirect(`/listings/${id}`);
//       })
//   );

//   module.exports = router;


const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js"); // Fixed typo
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");
const review = require("../models/review.js");

// Post Route for Reviews
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);

// Delete Review Route
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;