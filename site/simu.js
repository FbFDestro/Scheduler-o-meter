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


	for(var i = 0; i < qtdP; i++){
		var tam = tamLeg + 50 + (i/2)*((barW-tamLeg)/qtdP);
		var tamFim = (barW-tamLeg)/qtdP;
		cores.push(color(random(255),random(255),random(255)));
		fill(cores[i]);
		rect(tamLeg + 50 + i*((barW-tamLeg)/qtdP), 25, (barW-tamLeg)/qtdP, 55);
	}
	noStroke();
	fill(0);

	text("ID Processos", 55, 39); 
	text("Chega em", 55, 57); 
	text("Tempo de execucao", 55, 75); 

	
	textAlign(CENTER, CENTER);
	for(var i = 0; i < qtdP*2; i += 2){
		var tam = tamLeg + 50 + (i/2)*((barW-tamLeg)/qtdP);
		var tamFim = (barW-tamLeg)/qtdP;
		text(""+i/2, tam, 26, tamFim,18); 
		text(""+processData[i],tam, 45,tamFim,18); 
		text(""+processData[i+1],tam,63,tamFim,18); 
	}
	stroke(0); 

	line(50, 23+altura, barW+50, 23+altura);
	line(50, 42+altura, barW+50, 42+altura);

}

aux = 0;
quantum = -1;

function draw() {
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
				fill(cores[idsSJF[quantum]]);
				rect(50 + aux, 110+altura, tamP, 55);
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
	if(keyCode == 32 || keyCode == 13 || keyCode == 39){
		desenha();
	}
}
