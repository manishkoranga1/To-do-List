const express = require("express");
const bodyParser = require("body-parser");
const mongoose= require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemSchema={
  name: String
};

const Item=mongoose.model("Item",itemSchema);

const item1=new Item({
  name: "Welcome to your To-do list!"
});
const item2=new Item({
  name: "Hit the + button to add an item."
});
const item3=new Item({
  name: "<-- Hit this to delete an item"
});

const defaultItems=[item1,item2,item3];



app.get("/", function(req, res) {

  const day = date.getDate();

  Item.find({},function(err,foundItems){

    if(foundItems.longth===0){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("Successfully saved defaults items to DB.");
        }
      });
    }
    res.render("list", {listTitle: day, newListItems: foundItems});
  }); 

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item=new Item({
    name: itemName
  });
  item.save();
  res.redirect("/");
});
app.post("/delete", function(req, res){

  const checkedItemId= req.body.checkbox;
  
  Item.findByIdAndRemove(checkedItemId,function(err){
    if(!err){
      console.log("Successfully deleted checked item.");
      res.redirect("/");
    }
  });
  
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
