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
			this.aChange = tDist(startColor.a, endColor.a) / lifespan;

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
					push()
					translate(this.x, this.y);
					rotate(atan2(this.moveVec.y, this.moveVec.x)-PI/2);
					rect(0, 0, this.w, this.h);
					pop()
					break; 
				} 
		}
	}
	// updates all of the variables to fit where they should be on the timeline
	updateVariables(){
		this.runtime ++;
		this.w += this.wChange;
		this.h += this.hChange;
		this.currentColor.addColor(this.rChange, this.gChange, this.bChange, this.aChange);
		if(this.runtime > this.lifespan) parts = del(parts, this.id);
		totalCalculations += 5;
	}
	handleCollisions(){
		for(let i = 0; i < intObjs.length; i++){
			switch(intObjs[i].coliderType){
				case "Circle":
				if(intObjs[i].isColiding(this.x, this.y, this.w) == true){
					let a = atan2(this.y - intObjs[i].y, this.x - intObjs[i].x)-PI/2;
					let v1 = createVector(0, 0.5 + ((abs(this.moveVec.x) + abs(this.moveVec.y))/2) * 0.2);
					v1.rotate(a);
					this.moveVec.x = v1.x;
					this.x += this.moveVec.x;
					this.moveVec.y = v1.y;
					this.y += this.moveVec.y;
				}
				break;
				case "Line":
						if(intObjs[i].isColiding(this.x, this.y, 0.2 + (abs(this.moveVec.x) + abs(this.moveVec.y))/5) == true){
							let v1 = createVector(0, 0.5 + ((abs(this.moveVec.x) + abs(this.moveVec.y))/2) * 0.2);
							if(intObjs[i].normal == PI || intObjs[i].normal == -PI){
								if(this.y < intObjs[i].y1) v1.rotate(-PI);
							}
							else if(intObjs[i].normal == PI/2 || intObjs[i].normal == -PI/2){
								if(this.x > intObjs[i].x1) v1.rotate(-PI/2); 
								if(this.x < intObjs[i].x1) v1.rotate(PI/2); 
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
			this.moveVec.x += globalForces[i].xForce;
			this.moveVec.y += globalForces[i].yForce;
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