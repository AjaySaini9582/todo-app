//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const _=require("lodash");
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended :true}));
app.use(express.static("public"));
// this is first step for mongoose dadaBase
const mongoose=require("mongoose");
// this is for coonnect dataBase to mongoose  
mongoose.connect("mongodb+srv://Ajaysainu55555:test123@cluster0.n1jgo.mongodb.net/todoListdb",{useNewUrlParser:true}); 

// Scheam 
const itemsSchema={
  name:String
};
// crate mongoose model
const Item=mongoose.model("item",itemsSchema);

const item1=new Item({
  name:"welcome to your todolist"
});

const item2= new Item({
  name:"hit this check box"
});

const defaultItems=[item1,item2];


const listSchema={
name:String,
items:[itemsSchema]
};
const List=mongoose.model("List",listSchema);


app.get("/", function(req, res){

  
  Item.find({},function(err,foundItem){

    if (foundItem.length===0) {
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("successfully saved in default dataBase in DB ");
        }
        res.redirect("/");
      });     
    } else {
      res.render("list",{ListTitle:"Today", newListItems:foundItem});         
    }

  });
});

app.get("/:customListName",function(req,res){
    const customListName =_.capitalize(req.params.customListName);
    
    List.findOne({name:customListName},function(err,foundList){
        if(!err){
          if(!foundList){
          // create new list
          const list=new List({
            name:customListName,
            items:defaultItems
          });
          list.save();
          res.redirect("/"+ customListName);
          }
          else{
            // show an existing list
            res.render("list",{ListTitle:foundList.name, newListItems:foundList.items});
            
          }
        }
    });


    
});

app.post("/",function(req,res){
  
var itemName= req.body.newitem;
const ListName=req.body.list;


 const item=  new Item({
  name:itemName
 });
 if(ListName=== "Today"){
  item.save();
 res.redirect("/");
}else{
  List.findOne({name:ListName},function(err,foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+ListName); 
  });
}

});
app.post("/delete",function(req, res){
 const checkedItemId=req.body.checkbox; 
 const ListName=req.body.ListName;

if(ListName==="Today"){
  Item.findByIdAndRemove(checkedItemId, function(err){
    if(err){ 
      console.log(err);
    }
    else{
      console.log("successfully remove");
    }
    res.redirect("/")
   });
}
else{
  List.findOneAndUpdate({name:ListName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
    if(!err){
      res.redirect("/"+ListName);
    }
  });
}
 
});


app.get("/work",function(req,res){
  res.render("list",{ListTitle:"work list" ,newListItems:workitems});
});
app.post("/work",function(req,res){
  var item=req.body.newitem;
  workitems.push(item);
  res.redirect("/work");
});

app.get("/about",function(req,res){
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, function(){
  console.log("Server has started successfully");
});


