let mouseHasScrolled = false;
let scrollTimer = 0;
let mouseScrolled = 0; // When in use, reset mouse scrolled to 0 at the end of draw

function collc(x, y, w, h, x2, y2, w2, h2, bx, by)
{
	// apply the bezzle to the xs
	if (bx != 0 && bx != undefined)
	{
		x = x - bx / 2;
		x2 = x2 - bx / 2;
		w = w + bx;
		w2 = w2 + bx;
	}

	// apply the bezzle to the ys
	if (by != 0 && by != undefined)
	{
		y = y - by / 2;
		y2 = y2 - by / 2;
		h = h + by;
		h2 = h2 + by;
	}

	// draw hitboxes
	fill(200, 50, 50, 100);
	if (keyIsDown(72)) { rect(x, y, w, h); rect(x2, y2, w2, h2) }

	// actual collision check
	if (x + w > x2 && x < x2 + w2 && y + h > y2 && y < y2 + h2) return true;

	return false;
}

function del(array, id)
{
	let arr1 = []; // empty array that will replace the inputted array
	// itterate over the given array
	for (let i = 0; i < array.length; i++)
	{
		if (i != id) arr1.push(array[i]); // if the index is equal to the given index, dont push that item into the clear array	
		if (i > id && array[i].id != undefined) array[i].id--; // shift the other ID's down if they were above the deleted item if they have ids
	}
	return arr1;// return new array
}

function drawPolygon(vertecies)
{
	// begin / end shape draws lines and fills pixels in between vertecies
	beginShape();

	// itterate over the provided vertecies
	for (let i = 0; i < vertecies.length; i++)
	{
		vertex(vertecies[i].x, vertecies[i].y);
	}
	vertex(vertecies[0].x, vertecies[0].y); // close the shape
	endShape();
}

function mouseWheel(event)
{
	mouseScrolled = event.delta;
	mouseHasScrolled = true;
	scrollTimer = 0;
}

function timestamp()
{
	let time = month() + ":" + day() + ":" + hour() + ":" + minute() + ":" + second();
	return time;
}

// arrayCopy commonly runs into obscure issues, simpler function to do the same task
// untested for not 1d arrays
function copyArray(array)
{
	let newArr = Array(array.length);
	for (let i = 0; i < array.length; i++)
	{
		newArr[i] = array[i];
	}
	return newArr;
}