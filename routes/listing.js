const express = require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsyc.js");
const Listing =require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
// const upload = multer({dest:'uploads/'});
const upload = multer({storage});

router.route("/")
    .get(wrapAsync(listingController.index))//index route
    .post(isLoggedIn,validateListing,upload.single("listing[image]"),wrapAsync(listingController.createListing) //create route
);

//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
      .get(wrapAsync(listingController.showListing))//show route
      .put(isLoggedIn,isOwner,validateListing,upload.single("listing[image]"),wrapAsync(listingController.updateListing)) //update route
      .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing) //delete route
);

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports=router;
