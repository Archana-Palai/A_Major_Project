const Listing = require("../models/listing");

module.exports.index=async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index",{allListings});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
       return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing = async (req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    let listing = req.body.listing;
//    listing.image = {
//       filename: "listingimage",
//       url: listing.image.url || "https://images.unsplash.com/photo-1559767949-0faa5c7e9992?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//    };

   const newListing = new Listing(listing);
   newListing.owner=req.user._id;
   newListing.image={url,filename};
   await newListing.save();
   req.flash("success","New Listing Created!!");
   res.redirect("/listings");
};

module.exports.renderEditForm = async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
     if(!listing){
        req.flash("error","Listing you requested for does not exist!");
       return res.redirect("/listings");
    }
    
    let originalImageUrl = listing.image.url;
    console.log(originalImageUrl);
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250,e_blur:100");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing = async(req,res) =>{
   let {id} = req.params;
    let listing =await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }

    req.flash("success","Listing Updated!!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!!");
    res.redirect("/listings");
};
