let parts = [];
let globalForces = [];
let intObjs = [];
let globalRuntime = 0;

// global definitions such as forces, etc.
let gravity;
let mouseSpawner;

let totalCalculations = 0;
let doMouseInteraction = false;

let debugLevel = 3; // (1->3)

function setup() {
  createCanvas(windowWidth, windowHeight);
  globalDefinitions(); // definitions that cant be done outside of setup / outside of scope
  mouseSpawner = new spawner(mouseX, mouseY, 50, 50, [5, 20], [1, 10], [-5, 5], [-5, 5], [nColor(0, 0, 0), nColor(255, 255, 255)], [nColor(0, 0, 0), nColor(255, 255, 255 )], [200, 200], 5);
  new intCircle(width/2, height/2, 100);
  new intLine(100, 500, 600, 500);
  //new intSquare(200, 200, 200, 200);

  // in page console setup
  Console = new consoleClass();
  consoleInput = createInput();
  consoleInput.position(Console.logSpacing, height - 50);
  consoleInput.size((width/5)-((2*Console.logSpacing)+10), 30);
  defineThemes();
}

function globalDefinitions(){
  gravity = new force(0, 0, 0);
  globalForces.push(gravity);
}

function draw() {
  globalRuntime ++;
  background(50);
  mouseSpawner.setPosition(mouseX, mouseY);
  if(mouseIsPressed){
    mouseSpawner.spawnParts();
  }
  noStroke();
  for(let i = 0; i < parts.length; i++){
    if(parts[i].isStatic == false) parts[i].updatePhysics();
    parts[i].drawSelf(); 
    // calls updateVariables which deletes the particle when it excedes its lifespan
    // it is called later so it doesent delete itself before parts[i] is refferenced again
  }
  for(let i = 0; i < intObjs.length; i++){
    intObjs[i].drawSelf();
  }
  //sp1.spawnParts();
  drawDebug();
  totalCalculations = 0;
  onScreenConsole();
  Console.updateLoggers();
}

function tDist(x, x2){
  if(x < x2) return dist(x, 0, x2, 0);
  return -dist(x, 0, x2, 0);
}

function nColor(r, g, b, a){
  if(a == undefined) a = 255;
  return new colorObj(r, g, b, a);
}

function drawDebug(){
  // formatting
  fill(255);
  stroke(0);
  if(debugLevel >= 1){
    text("FPS: " + round(frameRate()), 20, 20);
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

    // for setPosition
    this.w = w;
    this.h = h;

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
  addPosition(x, y){
    this.minX += x;
    this.minY += y;
    this.maxX += x;
    this.maxY += y;
  }
  setPosition(x, y){
    this.minX = x-this.w/2;
    this.minY = y-this.h/2;
    this.maxX = x+this.w/2;
    this.maxY = y+this.h/2;
  }
}

class colorObj{
  constructor(r, g, b, a){
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    if(a == undefined) this.a = 255;
  }
  getSelf(){
    if(this.a == undefined) this.a = 255;
    return color(this.r, this.g, this.b, this.a);
  }
  addColor(r, g, b, a){
    this.r += r;
    this.g += g;
    this.b += b;
    if (a != undefined) this.a += a;
  }
  setColor(r, g, b, a){
    this.r = r;
    this.g = g;
    this.b = b;
    if (a != undefined) this.a = a;
  }
}