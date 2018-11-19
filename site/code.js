$(document).ready(function(){

	var vetorTop, qtdProcessos;
	var processos = [];
	var infoSJF = {}, infoSRT = {};
	var eventosSJF = {}, eventosSRT = {};
	var somaTempo = 0;
	var mediaSJF = 0, mediaSRT = 0;

	function criaObj(id, tempoChegada, tempoExecucao){
		return {
			"id": id, 
			"tempoChegada": tempoChegada,
			"tempoExecucao": tempoExecucao,
			"inicioSJF": 0,
			"terminoSJF": 0,
			"inicioSRT": [],
			"terminoSRT": []
		}
	}

	function imprimeObj(obj){
		var resp = "id " + obj.id + "\n";
		resp += "tempoChegada " + obj.tempoChegada + "\n";
		resp += "tempoExecucao " + obj.tempoExecucao + "\n";
		resp += "inicioSJF " + obj.inicioSJF + "\n";
		resp += "terminoSJF " + obj.terminoSJF + "\n";
		resp += "inicioSRT " + obj.inicioSRT + "\n";
		resp += "terminoSRT " + obj.terminoSRT + "\n";
		alert(resp);
	}

	$(".exemplo").click(function(){
		//fetch('https://vitorgt.github.io/Scheduler-o-meter/input/'+this.name+'.in')
		fetch('../input/'+this.name+'.in')
		.then(function(response) { return response.text(); })
		.then(function(myInput) {
			myInput = myInput.replace(/\s*\n/g,"/\n").replace( /\n/g," ").split(" ");
			vetorTop = myInput.slice(1);
			qtdProcessos = parseInt(myInput[0]);
			alert(qtdProcessos)
			alert(vetorTop)
			escalona();
			});
	});


	$(".btn").click(function(){
		qtdProcessos = parseInt($("input[name='qtdProcessos']").val());
		var tabela = $("textarea[name='tabelaProcessos']").val();
		if(tabela.length != 0){
			tabela = tabela.replace(/\s*\n/g,"/\n");
			vetorTop = tabela.replace( /\n/g," ").split(" ");
			alert(qtdProcessos)
			alert(vetorTop)
			escalona();
		}else{
			alert("Complete os campos adequadamente");
		}
	});
	
	function escalona(){
		for(var i = 0; i < vetorTop.length; i+=2){
			if(parseInt(vetorTop[i+1]) == 0){
				alert("Um processo nao pode ter tempo de execução 0\nEle será removido do simulador");
				qtdProcessos--;
			}
			else{
				vetorTop[i] = parseInt(vetorTop[i]);
				vetorTop[i+1] = parseInt(vetorTop[i+1]);
				processos.push(criaObj(parseInt(i/2), parseInt(vetorTop[i]),parseInt(vetorTop[i+1])));
			}
		}
		sjf();
		srtf();
		fit_eventos();

		localStorage.setItem("qtdProcessos",qtdProcessos);
		localStorage.setItem("infoSJF",JSON.stringify(infoSJF));
		localStorage.setItem("eventosSJF",JSON.stringify(eventosSJF));
		localStorage.setItem("infoSRT",JSON.stringify(infoSRT));
		localStorage.setItem("eventosSRT",JSON.stringify(eventosSRT));
		localStorage.setItem("somaTempo",somaTempo);
		localStorage.setItem("processData",JSON.stringify(vetorTop));
		localStorage.setItem("mediaSJF",mediaSJF);
		localStorage.setItem("mediaSRT",mediaSRT);

		window.open("simulacao.html");
	}



	function cmpChegada(a, b){
		if(a.tempoChegada == b.tempoChegada){
			if(a.tempoExecucao < b.tempoExecucao) return -1;
			if(a.tempoExecucao > b.tempoExecucao) return 1;
			if(a.tempoExecucao == b.tempoExecucao) return 0;
		}
		if (a.tempoChegada < b.tempoChegada) return -1;
		if (a.tempoChegada > b.tempoChegada) return 1;
	}

	function cmpExec(a, b) {
		if (a.tempoExecucao == b.tempoExecucao) {
			if (a.tempoChegada < b.tempoChegada) return -1;
			if (a.tempoChegada > b.tempoChegada) return 1;
			if (a.tempoChegada ==b.tempoChegada) return 0;
		}
		if (a.tempoExecucao < b.tempoExecucao) return -1;
		if (a.tempoExecucao > b.tempoExecucao) return 1;
	}

	function busca(id){
		for(var i=0;i<qtdProcessos;i++){
			if(processos[i].id == id) return i;
		}
		return -1; // não encontrou
	}

	str_pid = "O processo de ID ";
	str_add = " foi adicionado ao escalonador";
	str_exe = " foi executado uma vez";
	str_remov = " foi retirado do escalonador";
	str_reord = "O escalonador foi reordenado por tempo de execução restante";

	function sjf(){
		processos.sort(cmpChegada);

		var tempo = 0;
		var indiceProcessos = 0;

		var escalonador = [];

		while(indiceProcessos < qtdProcessos || escalonador.length != 0){ // enquanto não coloquei todos os processos no escalonador e ainda não acabei de processar tudo

			eventosSJF[tempo] = [];

			var reordena = false;
			while(indiceProcessos < qtdProcessos && processos[indiceProcessos].tempoChegada <= tempo) {
				escalonador.push(processos[indiceProcessos]);
				reordena = true;
				eventosSJF[tempo].push(str_pid + processos[indiceProcessos].id + str_add);
				indiceProcessos++;
			}
			if (reordena) {
				escalonador.sort(cmpExec);
				eventosSJF[tempo].push("O escalonador foi reordenado por tempo de execução");
			}

			if(escalonador.length != 0) { // se tem processos para executar
				var p = escalonador.shift();
				var id = busca(p.id);
				eventosSJF[tempo].push(str_pid + p.id + str_remov);
				processos[id].inicioSJF = tempo;
				for(var i = tempo; i < tempo + p.tempoExecucao; i++){
					infoSJF[i] = p.id;
					if (eventosSJF[i] === undefined) eventosSJF[i] = [];
					eventosSJF[i].push(str_pid + p.id + str_exe);
				}
				tempo += p.tempoExecucao;
				if(eventosSJF[tempo] === undefined) eventosSJF[tempo] = [];
				eventosSJF[tempo].push(str_pid + p.id + " foi finalizado");
				processos[id].terminoSJF = tempo;		
			}else { // se não tem processos, apenas incrementa no tempo
				tempo++;
			}
		}
		somaTempo = tempo;

		var somaAux = 0;
		for(var p of processos){
			somaAux += p.inicioSJF;
		}

		mediaSJF = somaAux/processos.length;

	}

	function srtf(){
		processos.sort(cmpChegada); 

		var tempo = 0;
		var indiceProcessos = 0;

		var escalonador = [];
		var idUltimoEx = -1;


		while(indiceProcessos < qtdProcessos || escalonador.length != 0){ // enquanto não coloquei todos os processos no escalonador e ainda não acabei de processar tudo
			eventosSRT[tempo] = [];
			var p;
			var tirou = false;
			if(escalonador.length != 0) { // se tem processos para executar
				p = escalonador.shift();
				eventosSRT[tempo].push(str_pid + p.id + str_remov);
				escalonador.sort(cmpExec);
				eventosSRT[tempo].push(str_reord);
				tirou = true;
			}

			while(indiceProcessos < qtdProcessos && processos[indiceProcessos].tempoChegada <= tempo) {
				if(!tirou){
					p = processos[indiceProcessos];
					//eventosSRT[tempo].push("O processo de ID " + p.id + " foi adicionado ao escalonador");
					eventosSRT[tempo].push(str_pid + p.id + str_add);
					eventosSRT[tempo].push(str_reord);
					eventosSRT[tempo].push(str_pid + p.id + str_remov);
					tirou = true;
				}else {
					escalonador.push(processos[indiceProcessos]);
					eventosSRT[tempo].push(str_pid + processos[indiceProcessos].id + str_add);
					escalonador.sort(cmpExec);
					eventosSRT[tempo].push(str_reord);
				}
				indiceProcessos++;
			}

			if(tirou) { // se tem processos para executar
				//printf("no tempo %d: tirou e executou %d, que tem %d de execucao restante\n",tempo,p.id, p.tempoExecucao);
				var id = busca(p.id);
				if(p.id != idUltimoEx){
					processos[id].inicioSRT = tempo;
				}
				idUltimoEx = p.id;
				p.tempoExecucao--;
				eventosSRT[tempo].push(str_pid + p.id + str_exe);
				if(p.tempoExecucao > 0) {
					escalonador.push(p);
					eventosSRT[tempo].push(str_pid + p.id + str_add);
					escalonador.sort(cmpExec);
					eventosSRT[tempo].push(str_reord);
					//printf("no tempo %d: colocou %d, que tem %d de execucao restante\n",tempo,p.id, p.tempoExecucao);
				}
				infoSRT[tempo] = p.id;
				tempo++;
				processos[id].terminoSRT = tempo;		
			}else { // se não tem processos, apenas incrementa no tempo
				tempo++;
			}
		}
		somaTempo = Math.max(somaTempo, tempo);

		var somaAux = 0;
		for(var p of processos){
			somaAux += p.inicioSRT;
		}

		mediaSRT = somaAux/processos.length;

	}

	function fit_eventos(){
		for(var i = 0; i < somaTempo; i++){
			var count = Math.abs(eventosSJF[i].length - eventosSRT[i].length);
			if(eventosSJF[i].length > eventosSRT[i].length){
				while(count--) eventosSRT[i].push("<br>");
			}else{
				while(count--) eventosSJF[i].push("<br>");
			}
		}
	}

});
