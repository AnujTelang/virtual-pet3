//Create variables here
var dog 
var happyDogImage
var dogImage
var database
var foodS=0;
var food
var bedRoomI
var GardenI
var WashroomI
var foodObj
var gameState
var foodStock
var lastfed
var lastfedHr
var foodStock
function preload()
{
  dogImage=loadImage("images/dogImg.png");
  happyDogImage=loadImage("images/dogImg1.png");
  bedRoomI=loadImage("images/Bed Room.png");
  GardenI=loadImage("images/Garden.png");
  WashroomI=loadImage("images/Wash Room.png");

}

function setup() {
  createCanvas(500,500);

  database = firebase.database();
  foodStock=database.ref('foodObj');
  
  feed=createButton("Feed the dog");
  feed.position(550,100);
  feed.mousePressed(feedDog);

  addFood=createButton("add the Food");
  addFood.position(450,100);
  addFood.mousePressed(addFoods);
  foodObj=new Food(200,200,20,20);
  foodStock.on('value',readStock);
  //alert("foodStock "+foodS);
 
 
  dog=createSprite(250,400,50,50)
  dog.addImage("dog",dogImage);
  dog.scale=0.5;

}


function draw() { 
  background("green") ;
  fill("white")
  textSize(15);

  readState=database.ref('gameState');
  readState.on("value",function(data){
gameState=data.val()
  })

  fedTime=database.ref('FeedTime');
  fedTimeHr=database.ref('FeedTimeHr');
  fedTime.on("value",function(data){
    lastfed=data.val();
  })

  fedTimeHr.on("value",function(data){
    lastfedHr=data.val();
  })

  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.scale=0
      }else{
      
      feed.show();
      addFood.show();
      dog.scale=0.2;
      dog.display();
      };
    

 // if(lastfed>6){

  //if(lastfed>6){ 
    
  //}
  /*else if (lastfed==0){
    text("last fed :12 Am",350,30);
  }else{
    text("last fed :"+lastfed+"Am",350,30);
  }*/
 
  

currentTime=minute();
//alert(currentTime);
if(currentTime==0){
  database.ref('/').update({
    foodObj:foodS,
    FeedTime:0
  })
}
if(currentTime-lastfed>=0 && currentTime-lastfed<=1 ) {
  update("Playing")
  foodObj.garden()
}else if(currentTime==(lastfed+2)){
update("Sleeping");
foodObj.bedroom();
}else if (currentTime>(lastfed+2)&&currentTime<=(lastfed+4)){
  update("bathing")
  foodObj.washroom();
}else{
  update("Hungry")
  //alert("hungry");
 // foodObj.display();
}


  text("food remaning :"+foodS,300,50);
  if(lastfedHr>12){ 
    text("last fed was at "+lastfedHr%+12+":"+lastfed+" pm",300,30);
  }else if (lastfedHr==0){
    text("last fed was at 12 am",300,30);
  }else{
    text("last fed was at "+lastfedHr+":"+lastfed+" am",300,30);
  }
  //alert(lastfed);
 // text("last fed :"+lastfed+" mins ",350,30);
  if(keyWentDown(UP_ARROW)){
    writeStock(foodS)
    //alert("adding image"+happyDogImage);
    dog.addImage("dog",happyDogImage);
    
  }
  
  foodObj.display();
  //drawSprites();
  //add styles here
 
}


function readStock(data){
 // alert("data is "+data);
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
  }
  
  function writeStock(x){
    //alert("foodS is ?"+foodS);
    if(x <= 0){
      x = 0;
    }
    else{
      x = x-1;
    }
      database.ref("/").update({
        foodObj : x,
      })
    }

function UP_ARROW(){
  if(keyWentDown(UP_ARROW)){
   // alert("foodS is"+foodS);
writeStock(foodS)
dog.addImage("dog", happyDogImage)
  }
}

function feedDog (){
  dog.addImage("dog", happyDogImage);
  feed.hide();
  foodS--;
  database.ref('/').update({
    foodObj:foodS,
    FeedTime:minute(),
    FeedTimeHr:hour()
  })

 //foodObj.updateFoodStock(foodObj.getFoodStock()-1);
/*database.ref("/").update({
  food : foodObj.getFoodStock(),
  FeedTime:hour()
})*/
}


function addFoods(){
  foodS++;
  database.ref('/').update({
    foodObj:foodS
  })
}

function update(state){
  database.ref('/').update({
  gameState:state
  })
}

