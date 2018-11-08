function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
	
	noStroke();
	
	background(220);
	
	rotate(-PI/2);
	stroke(0);
	textSize(18);
	text("SJF", -82,40); 
	text("SRTF", -242,40);
	noStroke();
	
	rotate(PI/2);
  
  barW = windowWidth-100;
  
	rect(50, 40, barW, 55);
	rect(50, 190, barW, 55);
	
	textSize(12);
	text("tempo", 50,18);
	stroke(0); 
	line(50, 20, barW+50, 20);
	fill(0);
	triangle(barW+40, 15, barW+40, 25, barW+50, 20);

	noStroke();
	text("tempo", 50,168);
	stroke(0); 
	line(50, 170, barW+50, 170);
	fill(0);
	triangle(barW+40, 165, barW+40, 175, barW+50, 170);
	
  
  
  qtdP = 20;
	somaT = 20;
  tamP = barW/somaT;
  
}

aux = 0;

function draw() {
  
  if(aux < barW) {

    noStroke();
    randomColor = color(random(255),random(255),random(255));
   	fill(randomColor);

  //  rect(x, y, w, h, [tl], [tr], [br], [bl])
    rect(50+aux, 40, tamP, 55);

    aux += tamP;
    
  }
	
}

function mousePressed(){
	redraw();
}
