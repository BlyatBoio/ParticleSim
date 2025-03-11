let parts = [];
let globalForces = [];
let intObjs = [];

// global definitions such as forces, etc.
let gravity;
let sp1;

let totalCalculations = 0;
let doMouseInteraction = false;

let debugLevel = 3; // (1->3)

function setup() {
  createCanvas(windowWidth, windowHeight);
  globalDefinitions(); // definitions that cant be done outside of setup / outside of scope
  sp1 = new spawner(200, 200, 200, 100, [5, 20], [1, 10], [-2, 2], [-2, 2], [nColor(0, 0, 0), nColor(255, 255, 255)], [nColor(0, 0, 0), nColor(255, 255, 255)], [50, 100], 5);
  /*
  new intCircle(300, 450, 100);
  new intCircle(350, 450, 100);
  new intCircle(350, 550, 100);
  */
  new intCircle(width/2, height/2, 100);
  new intLine(100, 500, 600, 500);
  new intSquare(200, 200, 200, 200);
}

function globalDefinitions(){
  gravity = new force(0, 0, 0);
  globalForces.push(gravity);
}

function draw() {
  background(50);
  if(mouseIsPressed){
    for(let i = 0; i < 10; i++){
      new particle(mouseX, mouseY, 10, 10, 5, 5, "Circle", random(-2, 2), random(-2, 2), nColor(50, 50, 200), nColor(200, 50, 50), false, 200);
    }
  }
  noStroke();
  for(let i = 0; i < parts.length; i++){
    if(parts[i].isStatic == false) parts[i].updatePhysics();
    parts[i].drawSelf(); // calls updateVariables which deletes the particle when it excedes its lifespan
    // it is called later so it doesent delete itself before parts[i] is refferenced again
  }
  for(let i = 0; i < intObjs.length; i++){
    intObjs[i].drawSelf();
  }
  //sp1.spawnParts();
  drawDebug();
  totalCalculations = 0;
}

function tDist(x, x2){
  if(x < x2) return dist(x, 0, x2, 0);
  return -dist(x, 0, x2, 0);
}

function nColor(r, g, b, a){
  if(a == undefined) a = 255;
  return new colorObj(r, g, b, a);
}

function del(arr, id){
  let newArr = []; // empty array
  for(let i = 0; i < arr.length; i++){
    if(i != id) newArr.push(arr[i]); // if it isnt at the index of id, push it into the empty array
    if(i > id) newArr[i-1].id --; // shift the larger ID's down so there is no gap at [ID]
  }
  return newArr;
}

function drawDebug(){
  // formatting
  fill(255);
  stroke(0);
  if(debugLevel >= 1){
    text("FPS: " + frameRate(), 20, 20);
  }
  if(debugLevel >= 2){
    text("Total Particles:" + parts.length, 20, 40);    
  }
  if(debugLevel == 3){
    text("Total Calculations: " + totalCalculations, 20, 60);
  }
}

function angleBetween(x1, y1, x2, y2){
  return atan2(y1 - y2, x1 - x2) + PI/2;
}

class intCircle{
  constructor(x, y, radius){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.id = intObjs.length;
    this.coliderType = "Circle";
    intObjs.push(this);
  }
  drawSelf(){
    fill(255);
    stroke(0);
    circle(this.x, this.y, this.radius);
  }
  isColiding(x, y, r){
    return dist(x, y, this.x, this.y) < (this.radius + r)/2;
  }
}

class intLine{
  constructor(x1, y1, x2, y2){
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.leg = dist(x1, y1, x2, y2);
    this.coliderType = "Line";
    this.id = intObjs.length;
    intObjs.push(this);
    this.normal = atan2(this.y1 - this.y2, this.x1 - this.x2);
  }
  drawSelf(){
    stroke(0);
    strokeWeight(3);
    line(this.x1, this.y1, this.x2, this.y2);
  }
  isColiding(x, y, r){
    let d1 = dist(x, y, this.x1, this.y1);
    let d2 = dist(x, y, this.x2, this.y2);
    return (d1 + d2 < this.leg+r);
  }
}

class intSquare{
  constructor(x, y, w, h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.line1 = new intLine(x, y, x + w, y);
    this.line1 = new intLine(x, y, x, y + h);
    this.line1 = new intLine(x + w, y, x + w, y + h);
    this.line1 = new intLine(x, y + h, x + w, y + h);
  }
}

class particle{
  constructor(x, y, startW, startH, endW, endH, shape, xVelocity, yVelocity, startColor, endColor, isStatic, lifespan){
    // position
    this.x = x;
    this.y = y;

    // size
    this.startW = startW;
    this.startH = startH;
    this.endW = endW;
    this.endH = endH;
    this.w = startW;
    this.h = startH;

    this.shape = shape;// determines colisions and how its drawn

    // movement xVel and yVel are starter values, the actual vector values change over time
    this.moveVec = createVector(xVelocity, yVelocity);

    // colors
    this.startColor = startColor;
    this.endColor = endColor;
    this.currentColor = new colorObj(startColor.r, startColor.g, startColor.b);

    this.isStatic = isStatic;

    // lifespan
    this.lifespan = lifespan;
    this.runtime = 0;
    // get the amount each variable changes per frame

      // size
      this.wChange = tDist(startW, endW) / lifespan;
      this.hChange = tDist(startH, endH) / lifespan;

      // color
      this.rChange = tDist(startColor.r, endColor.r) / lifespan;
      this.gChange = tDist(startColor.g, endColor.g) / lifespan;
      this.bChange = tDist(startColor.b, endColor.b) / lifespan;

    this.id = parts.length; // gets ID for delete system and other things
    parts.push(this);// pushes the particle into the particles array
  }
  drawSelf(){
    this.updateVariables(); // upate the variables
    if(this.x < width && this.x > 0 && this.y < height && this.y > 0){
      fill(this.currentColor.getSelf()); // fill the curent color

      // draw the shape based on the this.shape variable
      switch(this.shape){
        case "Circle":
          ellipse(this.x, this.y, this.w, this.h);
          break;
        case "Rect":
          rect(this.x, this.y, this.w, this.h);
          break; 
       } 
    }
  }
  // updates all of the variables to fit where they should be on the timeline
  updateVariables(){
    this.runtime ++;
    this.w += this.wChange;
    this.h += this.hChange;
    totalCalculations += 4
    this.currentColor.addColor(this.rChange, this.gChange, this.bChange);
    if(this.runtime > this.lifespan) parts = del(parts, this.id);
    totalCalculations += 1
  }
  handleCollisions(){
    for(let i = 0; i < intObjs.length; i++){
      switch(intObjs[i].coliderType){
        case "Circle":
          if(intObjs[i].isColiding(this.x, this.y, this.w) == true){
            let a = atan2(this.y - intObjs[i].y, this.x - intObjs[i].x)-PI/2;
            let v1 = createVector(0, 5 + (abs(this.moveVec.x) + abs(this.moveVec.y)) * 0.2);
            v1.rotate(a);
            this.moveVec.x = v1.x;
            this.x += this.moveVec.x;
            this.moveVec.y = v1.y;
            this.y += this.moveVec.y;
          }
          break;
        case "Line":
          if(intObjs[i].isColiding(this.x, this.y, 0.2 + (abs(this.moveVec.x) + abs(this.moveVec.y))/5) == true){
            let v1 = createVector(0, 2 + (abs(this.moveVec.x) + abs(this.moveVec.y)) * 0.2);
            if(intObjs[i].normal == 0 ||  intObjs[i].normal == TWO_PI){
              rect(100, 100, 100);
              if(this.x < intObjs[i].x1) v1.rotate(PI); 
            }
            else{
              let a1 = atan2(this.y - intObjs[i].y1, this.x - intObjs[i].x1);
              if(a1 < intObjs[i].normal - PI/2 && a1 > intObjs[i].normal + PI/2) v1.rotate(-intObjs[i].normal);
              else v1.rotate(intObjs[i].normal);
            }
            
            this.moveVec.x += v1.x;
            this.x += this.moveVec.x;
            this.moveVec.y = v1.y;
            this.y += this.moveVec.y;
          }
          break;
      }
    }
  }
  updatePhysics(){
    // apply global forces to the particle
    for(let i = 0; i < globalForces.length; i++){
      this.moveVec.x += globalForces[i].getXForce();
      this.moveVec.y += globalForces[i].getYForce();
      totalCalculations += 3
    }

    // mouse "selection / grabbing"
    if(doMouseInteraction == true && mouseIsPressed && dist(this.x, this.y, mouseX, mouseY) < 150){
      this.x += movedX;
      this.y += movedY;
      this.moveVec.x = 0;
      this.moveVec.y = 0;
      totalCalculations += 3;
    } 
    else{
      // apply the movement vector to the poition
      this.x += this.moveVec.x;
      this.y += this.moveVec.y;
      totalCalculations += 3;
    }
    this.handleCollisions();
  }
}

class force{
  constructor(xForce, yForce, rotation){
    // often times, it will be just a x or y force so rotation may not be included
    if(rotation == undefined) rotation = 0;
    this.xForce = xForce;
    this.yForce = yForce;
    this.forceVec = createVector(xForce, yForce);
    this.forceVec.rotate(rotation);
    this.rotation = rotation;
  }
  // return the xforce
  getXForce(){
    return this.xForce;
  }
  // return the yforce
  getYForce(){
    return this.yForce;
  }
  // returns the total force
  getTotalForce(){
    return this.xForce + this.yForce;
  }
  // apply another force to this force
  addForce(force){
    this.xForce += force.xForce;
    this.yForce += force.yForce;
    this.forceVec.x += force.forceVec.x;
    this.forceVec.y += force.forceVec.y;
  }
  // rotate the given force by x
  rotateBy(angle){
    this.rotation += angle;
    this.forceVec.rotate(angle);
    this.xForce = this.forceVec.x;
    this.yForce = this.forceVec.y;
  }
}

class localForce{
  constructor(force, xPos, yPos, range){
    this.force = force;
    this.xPos = xPos;
    this.yPos = yPos;
    this.range = range;
  }
  drawSelf(){
    push();
    stroke(0);
    translate(this.xPos, this.yPos);
    rotate(this.force.rotation);
    line(-this.force.getTotalForce(), 0, this.force.getTotalForce(), 0);
    fill(255);
    triangle(-this.force.getTotalForce(), -10, this.force.getTotalForce(), 10, this.force.getTotalForce() + 20, 0);
    pop();
  }
  shouldApply(x, y){
    totalCalculations += 3;
    let d = dist(x, y, this.xPos, this.yPos); // get the distance from the proposed point to this force position
    return d < this.range; // boolean
  }
}

class spawner{
  // all particle vars should be input as arrays of [min, max] 
  constructor(x, y, w, h, size1Range, sizeChange, xVelRange, yVelRange, startColorRange, endColorRange, lifeSpanRange, partsPerFrame){
    // position range
    this.minX = x;
    this.minY = y;
    this.maxX = x + w;
    this.maxY = y + h;

    // size range
    this.size1Range = size1Range;
    this.sizeChange = sizeChange;

    // velocity range
    this.xVelRange = xVelRange;
    this.yVelRange = yVelRange;

    this.startColorRange = startColorRange; // [colorObj, colorObj]
    this.endColorRange = endColorRange; // [colorObj, colorObj]
    this.lifeSpanRange  = lifeSpanRange;
    this.partsPerFrame = partsPerFrame;
  }
  spawnParts(){
    // if it is spawning less than one particle per frame and a random number apropriate to that num
    if(this.partsPerFrame < 1 && random(0, 1/this.partsPerFrame) == 1) this.newPart();
    else{
      for(let i = 0; i < this.partsPerFrame; i++){
        this.newPart();
      }
    }
  }
  newPart(){
    let newSize = random(this.size1Range[0], this.size1Range[1]);
    let newSize2 = newSize + random(this.sizeChange[0], this.sizeChange[1]);
    new particle(
      random(this.minX, this.maxX), random(this.minY, this.maxY), // random position
      newSize, // random start width
      newSize, // random start height
      newSize2, // random second width
      newSize2, // random second height
      "Circle",
      random(this.xVelRange[0], this.xVelRange[1]), random(this.yVelRange[0], this.yVelRange[1]), // random velocity
      nColor( // new start color
        random(this.startColorRange[0].r, this.startColorRange[1].r), 
        random(this.startColorRange[0].g, this.startColorRange[1].g),
        random(this.startColorRange[0].b, this.startColorRange[1].b)
      ),
      nColor( // new end color
        random(this.endColorRange[0].r, this.endColorRange[1].r), 
        random(this.endColorRange[0].g, this.endColorRange[1].g),
        random(this.endColorRange[0].b, this.endColorRange[1].b)
      ), false,
      random(this.lifeSpanRange[0], this.lifeSpanRange[1]), // random lifespan
    )
  }
}

class colorObj{
  constructor(r, g, b){
    this.r = r;
    this.g = g;
    this.b = b;
  }
  getSelf(){
    return color(this.r, this.g, this.b);
  }
  addColor(r, g, b){
    this.r += r;
    this.g += g;
    this.b += b;
  }
  setColor(r, g, b){
    this.r = r;
    this.g = g;
    this.b = b;
  }
}
