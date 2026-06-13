const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    // image:{
    //     type:String,
    //     default:"https://www.istockphoto.com/photo/sunrise-behind-a-tropical-island-in-the-maldives-gm1151755587-312229721?utm_source=unsplash&utm_medium=affiliate&utm_campaign=srp_photos_bottom&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fsunset-with-tree&utm_term=sunset+with+tree%3A%3A%3A%3A381a8723-0197-440f-a46d-5671752e90cb" ,
    //     set :(v) => v === "" ? "https://www.istockphoto.com/photo/sunrise-behind-a-tropical-island-in-the-maldives-gm1151755587-312229721?utm_source=unsplash&utm_medium=affiliate&utm_campaign=srp_photos_bottom&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fsunset-with-tree&utm_term=sunset+with+tree%3A%3A%3A%3A381a8723-0197-440f-a46d-5671752e90cb" : v,
    // },
    image: {
    url:String,
    filename: String,
   },
    price:Number,
    location:String,
    country:String,
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref:"Review"
      },
    ],
    owner:{
      type:Schema.Types.ObjectId,
      ref:"User",
    }
});

//this part only work when we will delete any list then all its review also get deleted
listingSchema.post("findOneAndDelete",async(listing) =>{
   if(listing){
     await Review.deleteMany({_id:{$in:listing.reviews}});
   }
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;