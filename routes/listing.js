const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); // Fixed typo
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer  = require("multer");
const { storage } = require("../cloudConfig.js");
const { get } = require("mongoose");
const upload = multer({ storage });

router
  .route("/")
 .get(wrapAsync(listingController.index))
.post(
  isLoggedIn,
  validateListing,
upload.single("listing[name]"),

wrapAsync(listingController.createListing)
);
//.post(upload.single("listing[image]"), (req, res) => {
 // res.send(req.file);
//});


// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
   .route("/:id")
  .get( wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing)
)
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
);

// Edit Route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);

module.exports = router;