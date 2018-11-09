function setup() {

	var canvas = createCanvas(windowWidth, 300);
	canvas.parent("simulacao");

	elementoEventosSJF = $("#eventosSJF");
	$("button.proxSeg").click(desenha);
	$("button.ateFim").click(desenhaTudo);

	background("#eee");

	noLoop();

	altura = 20;

	rotate(-PI/2);
	stroke(0);
	textSize(18);
	text("SF", -149 - altura,40); 
	text("SRTF", -242 - altura,40);
	noStroke();
	rotate(PI/2);

	barW = windowWidth - 100;

	fill(255);
	rect(50, 25, barW, 55);
	rect(50, 110 + altura, barW, 55);
	rect(50, 190 + altura, barW, 55);

	fill(0);
	textSize(12);
	text("tempo", 50,88+altura);
	stroke(0); 
	line(50, 90+altura, barW+50, 90+altura);
	triangle(barW+40, 85+altura, barW+40, 95+altura, barW+50, 90+altura);

	idsSJF = JSON.parse(localStorage.getItem("infoSJF"));
	eventosSJF = JSON.parse(localStorage.getItem("eventosSJF"));
	idsSRTF = JSON.parse(localStorage.getItem("infoSRT"));
	qtdP = parseInt(localStorage.getItem("qtdProcessos"));
	somaT = parseInt(localStorage.getItem("somaTempo"));
	processData = [0,2,0,4,3,1,3,1,3,1];
	//localStorage.getItem("processData")
	tamP = barW/somaT;
	cores = [];
	for(var i = 0; i < qtdP; i++){
		cores.push(color(random(255),random(255),random(255)));
		fill(cores[i]);
		rect(50 + i*(barW/qtdP), 25, barW/qtdP, 55);
	}
	noStroke();
	fill(0);
	for(var i = 0; i < qtdP*2; i += 2){
		text("Processo "+i/2, 55 + (i/2)*(barW/qtdP), 40); 
		text("Chega em "+processData[i], 55 + (i/2)*(barW/qtdP), 55); 
		text("Tempo de execucao "+processData[i+1]+"s", 55 + (i/2)*(barW/qtdP), 70); 
	}
	stroke(0); 

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
					rect(50 + aux, 110+altura, tamP, 55);

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



