const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname+"/date.js")
const mongoose = require("mongoose")
const _ =require('lodash');


// console.log(date());

const app =  express();
app.set('view engine', 'ejs'); 

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); 
// const body = 

app.use(express.static("public"));











mongoose.connect('mongodb+srv://sanyam:5421@cluster0.6hvykuh.mongodb.net/?retryWrites=true&w=majority/todolistDB');

const itemsSchema= {
    name : String
}

const Item = mongoose.model('Item',itemsSchema)

const item1 = new Item({
    name: "welcome to todolist"
})
const item2 = new Item({
    name: "hit + to add a new item"
})
const item3 = new Item({
    name: "hit -- to delete"
})
const defaultItems =[item1,item2,item3]

const listSchema ={
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List",listSchema)



// let items = ["Buy the food","Cook the food", "Eat the food"];
// let workItems = [];

app.get("/",function(req,res){
    // res.send('hello');
    
    Item.find({},function(err, foundItems){
        

        if(foundItems.length === 0){
            
            Item.insertMany(defaultItems,function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("done ");
                }
            })
            
            res.redirect("/");
        } else{

            res.render("list",{listTitle: "Today",newListItem: foundItems});

        }


        if(err){
            console.log(err)
        }
        
    })

    let day = date.getDate();
        

})



app.get("/:customListName", function(req,res){
    const customListName = _.upperFirst(req.params.customListName);

    List.findOne({name:customListName}, function(err , foundList){
        if(!err){
            if(!foundList){
                console.log("doesent exist ");
                const list = new List ({ 
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/"+customListName) 
            }else{
                res.render("list", {listTitle: foundList.name ,newListItem: foundList.items})
            }
        }
    })

})






app.post("/", function(req,res){
    

    // var item = req.body.newItem;

    // if(req.body.list === 'Work'){
    // workItems.push(item);
    // res.redirect("/work");

    // }else{

    //     itemsArray.push(item);
    //     res.redirect("/");
    // }

    // console.log(req.body);

  const itemName = req.body.newItem;
  const listName = req.body.list;


  let item = new Item ({
    name : itemName
  })
  
  if(listName === "Today"){
      item.save();
      res.redirect('/')
  }else{
    List.findOne({name:listName}, function(err, foundList){
        foundList.items.push(item);
        foundList.save()
        res.redirect('/'+listName);
    })
  }




    
   
})


app.post("/delete",function(req,res){

    const checkedItemId =req.body.checkbox;
    const listName = req.body.listName;
    
    if(listName === "Today"){
        Item.findByIdAndRemove(checkedItemId, function(err){
          if(!err){
            console.log("successfully removed item from db");
          }
        })
        res.redirect('/')

    }else{
        List.findOneAndUpdate({name: listName}, {$pull:{items:{_id:checkedItemId}}}, function(err , foundList){
            if(!err){
                 res.redirect('/'+listName)
            }
        })
    }

});

app.get("/work", function(req,res){
 
    res.render("list", {listTitle: "Work List", newListItem : workItems})

});

// app.post("/work", function(req,res){
//     let item = req.body.newItem;
//     workItems.push(item);
//     res.redirect("/work"); 
// })
app.get("/about",function(req,res){
    res.render("about");
})

app.listen(3000, function(){
    console.log("Server is reunning on port 3000");
}) 
