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