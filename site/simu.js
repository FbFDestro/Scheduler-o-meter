function ehClaro(cor){
	return brightness(cor) < 75;
}

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
	processData = JSON.parse(localStorage.getItem("processData"));
	alert(processData);
	tamP = barW/somaT;
	cores = [];

	fill(255);
	var tamLeg = 120;
	rect(50, 25, tamLeg, 55);


	textAlign(CENTER, CENTER);
	for(var i = 0; i < qtdP; i++){
		stroke(0);
		var tam = tamLeg + 50 + i*((barW-tamLeg)/qtdP);
		var tamFim = (barW-tamLeg)/qtdP;
		cores.push(color(random(255),random(255),random(255)));
		fill(cores[i]);
		rect(tam, 25,tamFim, 55);

		noStroke();
		if(ehClaro(cores[i])){
			fill(255);
		}else {
			fill(0);
		}
		text("" + i, tam+1, 26, tamFim,18); 
		text(""+processData[i*2],tam+1, 45,tamFim,18); 
		text(""+processData[(i*2)+1],tam+1,63,tamFim,18); 
	}


	fill(0);

	textAlign(LEFT);
	text("ID Processos", 55, 36); 
	text("Chega em", 55, 55); 
	text("Tempo de execucao", 55, 73); 

	stroke(0); 

	line(50, 23+altura, barW+50, 23+altura);
	line(50, 42+altura, barW+50, 42+altura);

}

aux = 0;
quantum = -1;

function draw() {
	textAlign(CENTER, CENTER);
	if (quantum != -1) {
		if (aux < barW - (tamP / 2)) {
			elementoEventosSJF.append("<p>Eventos no instante " + quantum + "</p>");
			if(eventosSJF[quantum] != undefined){
				var none = true;
				for(i in eventosSJF[quantum]){
					elementoEventosSJF.append("<p>" + eventosSJF[quantum][i] + "</p>");
					none = false;
				}
				if(none){
					elementoEventosSJF.append("<p>Nenhum evento</p>");
				}
			}
			if (idsSJF[quantum] !== undefined) {
				stroke(0);
				fill(cores[idsSJF[quantum]]);
				rect(50 + aux, 110+altura, tamP, 55);

				console.log("tam P "+tamP);
				if (tamP > 18) {
					noStroke();
					if (ehClaro(cores[idsSJF[quantum]])) {
						fill(255);
					} else {
						fill(0);
					}
					text(String(idsSJF[quantum]), 51 + aux, 110 + altura, tamP, 55);
				}
			}

			if (idsSRTF[quantum] !== undefined) {
				stroke(0)
				fill(cores[idsSRTF[quantum]]);
				rect(50 + aux, 190+altura, tamP, 55);
				if (tamP > 18) {
					noStroke();
					if (ehClaro(cores[idsSRTF[quantum]])) {
						fill(255);
					} else {
						fill(0);
					}
					text(String(idsSRTF[quantum]), 51 + aux, 190 + altura, tamP, 55);
				}
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
	if(keyCode == 32 || keyCode == 13 || keyCode == 39){
		desenha();
	}
}
