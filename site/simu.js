function setup() {
	var canvas = createCanvas(windowWidth, 300);
	canvas.parent("simulacao");

	elementoEventosSJF = $("#eventosSJF");
	$("button.proxSeg").click(desenha);
	$("button.ateFim").click(desenhaTudo);


	noLoop();
	noStroke();

	background("#eee");

	altura = 20;

	rotate(-PI/2);
	stroke(0);
	textSize(18);
	text("SF", -82 - altura,40); 
	text("SRTF", -242 - altura,40);
	noStroke();

	rotate(PI/2);

	barW = windowWidth-100;

	rect(50, 40 + altura, barW, 55);
	rect(50, 190 + altura, barW, 55);
	//rect(windowWidth/2-barW/6, 290, barW/3, 55);

	textSize(12);
	text("tempo", 50,18+altura);
	stroke(0); 
	line(50, 20+altura, barW+50, 20+altura);
	fill(0);
	triangle(barW+40, 15+altura, barW+40, 25+altura, barW+50, 20+altura);

	noStroke();
	text("tempo", 50,168+altura);
	stroke(0); 
	line(50, 170+altura, barW+50, 170+altura);
	fill(0);
	triangle(barW+40, 165+altura, barW+40, 175+altura, barW+50, 170+altura);

	idsSJF = JSON.parse(localStorage.getItem("infoSJF"));
	eventosSJF = JSON.parse(localStorage.getItem("eventosSJF"));
	console.log(eventosSJF);
	idsSRTF = JSON.parse(localStorage.getItem("infoSRT"));
	qtdP = parseInt(localStorage.getItem("qtdProcessos"));
	somaT = parseInt(localStorage.getItem("somaTempo"));
	tamP = barW/somaT;
	cores = [];
	for(i = 0; i < qtdP; i++){
		cores.push(color(random(255),random(255),random(255)));
	}

}

aux = 0;
quantum = -1


function draw() {

	if (quantum != -1) {
		if (aux < barW - (tamP / 2)) {
	//		noStroke();

			elementoEventosSJF.append("<p>Eventos em " + quantum + "</p>")

			if (idsSJF[quantum] !== undefined) {

				fill(cores[idsSJF[quantum]]);
				rect(50 + aux, 40+altura, tamP, 55);

			}

			//console.log(eventosSJF[quantum]);
			if(eventosSJF[quantum] != undefined){
				console.log(eventosSJF[quantum][0]);
				for(i in eventosSJF[quantum]){
					console.log(eventosSJF[quantum][i]);
					elementoEventosSJF.append("<p>" + eventosSJF[quantum][i] + "</p>");
				}
			}

			if (idsSRTF[quantum] !== undefined) {

				fill(cores[idsSRTF[quantum]]);
				rect(50 + aux, 190+altura, tamP, 55);

			}
		}

	}

}

function desenha(){
	if(quantum == -1){
		aux = 0;
		quantum = 0;
	}else {
		quantum += 1;
		aux += tamP;
	}
	redraw();
}

function desenhaTudo(){
	while(aux < barW - (tamP / 2)){
		desenha();
	}
}

function keyPressed(){
	//console.log(keyCode);
	if(keyCode == 32 || keyCode == 13 || keyCode == 39){
		desenha();
	}
}



