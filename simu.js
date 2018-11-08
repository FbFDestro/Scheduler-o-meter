function setup() {
	createCanvas(windowWidth, windowHeight);
	noLoop();

	noStroke();

	background("#eee");

	rotate(-PI/2);
	stroke(0);
	textSize(18);
	text("SF", -82,40); 
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

	qtdP = 6;//localStorage.getItem("qtdProcessos");
	somaT = 3;//localStorage.getItem("somaTempo");
	tamP = barW/somaT;
  cores = [];
  for(i = 0; i < qtdP; i++){
    cores.push(color(random(255),random(255),random(255)));
  }

}

aux = 0;
quantum = 0

function draw() {

	if(aux < barW-(tamP/2)) {

		noStroke();
		fill(cores[0]);
		rect(50+aux, 40, tamP, 55);
		rect(50+aux, 190, tamP, 55);

		aux += tamP;

	}

}

function mousePressed(){
  quantum += 1;
	redraw();
}
