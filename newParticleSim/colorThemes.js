
let currentColorTheme;
let basicTheme;
let purpleTheme;
let lightMode;
let transparentTheme;

function defineThemes(){
  colorMode(RGB);
  basicTheme = new colorTheme(
		"Default",
		[color(70)], 
		[color(255), color(150), color(255, 70, 70)], 
		[color(0), color(0), color(0)],
		[color(40), color(20), color(60)], 
		[color(50)]
	);
	purpleTheme = new colorTheme(
		"Purple",
		[color(60, 60, 80)],
		[color(200), color(140, 140, 180), color(200, 100, 100)],
		[color(0), color(0), color(0)],
		[color(40, 40, 60), color(20, 20, 40), color(60, 60, 80)],
		[color(0)],
	);
	lightMode = new colorTheme(
		"Light",
		[color(255)],
		[color(50), color(100), color(255, 70, 70)],
		[color(0), color(0), color(0)],
		[color(180), color(160), color(200)],
		[color(0)],
	);
  transparentTheme = new colorTheme(
    "Transparent",
		[color(0, 0, 0, 0)],
		[color(250), color(100), color(255, 70, 70)],
		[color(0), color(0), color(0)],
		[color(100, 100, 100, 100), color(80), color(120)],
		[color(0)],
  );
  currentColorTheme = transparentTheme;
}

class colorTheme {
	constructor(name, backgroundColors, textColors, textBorderColors, fillColors, fillBorderColors){
		this.name = name;
		this.backgroundColors = backgroundColors;
		this.textColors = textColors;
		this.textBorderColors = textBorderColors;
		this.fillColors = fillColors;
		this.fillBorderColors = fillBorderColors;
	}
}

function themeBackground(variation){
	if(variation == undefined) variation = 0;
	background(currentColorTheme.backgroundColors[variation]);
}

function setThemeText(variation){
	if(variation == undefined) variation = 0;
	fill(currentColorTheme.textColors[variation]);
	stroke(currentColorTheme.textBorderColors[variation]);
}

function setThemeFill(variation){
	if(variation == undefined) variation = 0;
	fill(currentColorTheme.fillColors[variation]);
	stroke(currentColorTheme.fillBorderColors[variation]);
}
