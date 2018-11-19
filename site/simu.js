function ehClaro(cor){
	return lightness(cor) < 45;
}

function setup() {

	var canvas = createCanvas(windowWidth, 290);
	canvas.parent("simulacao");

	elementoEventosSJF = $("#eventosSJF");
	elementoEventosSRT = $("#eventosSRT");
	$("button.proxSeg").click(desenha);
	$("button.ateFim").click(desenhaTudo);

	background("#eee");

	noLoop();

	altura = 20;

	rotate(-PI/2);
	stroke(0);
	textSize(18);
	text("SJF", -151 - altura,40); 
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
	eventosSRT = JSON.parse(localStorage.getItem("eventosSRT"));
	qtdP = parseInt(localStorage.getItem("qtdProcessos"));
	somaT = parseInt(localStorage.getItem("somaTempo"));
	processData = JSON.parse(localStorage.getItem("processData"));
	mediaSRT = parseFloat(localStorage.getItem("mediaSRT"));
	mediaSJF = parseFloat(localStorage.getItem("mediaSJF"));
	tamP = barW/somaT;
	ticH = 12;
	cores = [];

	fill(255);
	var tamLeg = 130;
	rect(50, 25, tamLeg, 55);


	textAlign(CENTER, CENTER);
	for(var i = 0; i < qtdP; i++){
		stroke(0);
		var tamFim = (barW-tamLeg)/qtdP;
		var tam = tamLeg + 50 + i*tamFim;
		cores.push(color(random(255),random(255),random(255)));
		fill(cores[i]);
		rect(tam, 25,tamFim, 55);

		noStroke();
		if(ehClaro(cores[i]))
			fill(255);
		else
			fill(0);
		text(""+i, tam+1, 26, tamFim,18); 
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

	jamonta = false;
	if(jamonta){
		for(var i = 0; i < somaT; i++){
			line(50+(i*tamP), 90+altura-(ticH/2), 50+(i*tamP), 90+altura+(ticH/2));
		}
		if(tamP > 18){
			noStroke();
			textAlign(CENTER, CENTER);
			for(var i = 0; i < somaT; i++){
				text(String(i), 51+(i*tamP), 80+altura, Math.round(tamP), 40);
			}
		}
	}

}

aux = 0;
quantum = -1;
fim = true;

function draw() {
	textAlign(CENTER, CENTER);
	if (quantum != -1) {
		if (aux < barW - (tamP / 2)) {
			elementoEventosSJF.append("<p class='tempo'><b>Eventos no instante " + quantum + ":</b></p>");
			elementoEventosSRT.append("<p class='tempo'><b>Eventos no instante " + quantum + ":</b></p>");
			if(eventosSJF[quantum] != undefined){
				var none = true;
				for(i in eventosSJF[quantum]){
					if(eventosSJF[quantum][i] != "<br>") eventosSJF[quantum][i] = "• " + eventosSJF[quantum][i];
					elementoEventosSJF.append("<p>" + eventosSJF[quantum][i] + "</p>");
					none = false;
				}
				if(none){
					elementoEventosSJF.append("<p>• Nenhum evento</p><br>");
				}else{
					elementoEventosSJF.append("<p><br></p>");
				}
			}
			if(eventosSRT[quantum] != undefined){
				var none = true;
				for(i in eventosSRT[quantum]){
					if(eventosSRT[quantum][i] != "<br>") eventosSRT[quantum][i] = "• " + eventosSRT[quantum][i];
					elementoEventosSRT.append("<p>" + eventosSRT[quantum][i] + "</p>");
					none = false;
				}
				if(none){
					elementoEventosSRT.append("<p>• Nenhum evento</p><br>");
				}else{
					elementoEventosSRT.append("<p><br></p>");
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
			if(!jamonta){
				stroke(0)
				fill(0);
				line(50+aux+tamP, 90+altura-(ticH/2), 50+aux+tamP, 90+altura+(ticH/2));
				if(tamP > 18){
					noStroke();
					textAlign(CENTER, CENTER);
					text(String(quantum), 51+aux, 80+altura, Math.round(tamP), 40);
				}
			}
		}else if(fim) {
			fim = false;
			elementoEventosSRT.append("<p><b>A média de espera foi: " + mediaSRT + "</b></p>");
			elementoEventosSJF.append("<p><b>A média de espera foi: " + mediaSJF + "</b></p>");

		}
	}
}

function desenha(){
	if(quantum == -1){
		aux = 0;
		quantum = 0;
		stroke(0)
		fill(0);
		line(50, 90+altura-(ticH/2), 50, 90+altura+(ticH/2));
	}else {
		quantum += 1;
		aux += tamP;
	}
	redraw();
	$('#eventos').scrollTop($('#eventos')[0].scrollHeight);
}

function desenhaTudo(){
	while(aux < barW - (tamP / 2)){
		desenha();
	}
	$('#eventos').scrollTop($('#eventos')[0].scrollHeight);
}

function keyPressed(){
	if(keyCode == 32 || keyCode == 13 || keyCode == 39){
		desenha();
	}
}
