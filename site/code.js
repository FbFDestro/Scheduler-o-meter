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
			"terminoSRT": 0
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
	
	function trataInput(myInput){
		myInput = myInput.replace(/\s*\n/g,"\n");
		myInput = myInput.replace( /\n/g," ").split(" ");
		qtdProcessos = parseInt(myInput[0]);
		vetorTop = myInput.slice(1, myInput[0]*2+1);
		escalona();
	}

	$(".exemplo").click(function(){
		//fetch('https://vitorgt.github.io/Scheduler-o-meter/input/'+this.name+'.in')
		fetch('../input/'+this.name+'.in')
		.then(function(response) { return response.text(); })
		.then(function(myInput) { trataInput(myInput); });
	});


	$(".btn").click(function(){
		qtdProcessos = parseInt($("input[name='qtdProcessos']").val());
		var tabela = $("textarea[name='tabelaProcessos']").val();
		if(tabela.length != 0){
			tabela = tabela.replace(/\s*\n/g,"\n");
			vetorTop = tabela.replace( /\n/g," ").split(" ");
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
	str_fim = " foi finalizado";

	function sjf(){
		processos.sort(cmpChegada);

		var tempo = 0;
		var indiceProcessos = 0;

		var escalonador = [];

		while(indiceProcessos < qtdProcessos || escalonador.length != 0){ // enquanto não coloquei todos os processos no escalonador e ainda não acabei de processar tudo

			var inseriu = false;
			eventosSJF[tempo] = [];

			while(indiceProcessos < qtdProcessos && processos[indiceProcessos].tempoChegada <= tempo){
				escalonador.push(processos[indiceProcessos]);
				eventosSJF[tempo].push(str_pid + processos[indiceProcessos].id + str_add);
				indiceProcessos++;
				inseriu = true;
			}

			if(inseriu){
				escalonador.sort(cmpExec);
				eventosSJF[tempo].push("O escalonador foi reordenado por tempo de execução");
			}

			if(escalonador.length > 0){

				var p = escalonador.shift();
				eventosSJF[tempo].push(str_pid + p.id + str_remov);

				for(var i = 0; i < p.tempoExecucao;i++){
					infoSJF[tempo+i] = p.id;
					if (eventosSJF[tempo+i] === undefined) eventosSJF[tempo+i] = [];
					eventosSJF[tempo+i].push(str_pid + p.id + str_exe);
				}

				var id = busca(p.id);
				processos[id].inicioSJF = tempo;
				tempo += p.tempoExecucao;
				processos[id].terminoSJF = tempo;
				if(eventosSJF[tempo-1] === undefined) eventosSJF[tempo-1] = [];
				eventosSJF[tempo-1].push(str_pid + p.id + str_fim);

			}else {
				tempo++;
			}
		
		}
		somaTempo = tempo;

		var somaAux = 0;
		for(var p of processos){
			somaAux += p.inicioSJF; 
		}

		mediaSJF = somaAux/qtdProcessos;

	}

	function srtf(){
		processos.sort(cmpChegada); 

		var tempo = 0;
		var indiceProcessos = 0;
		var ultExec = -1;

		var escalonador = [];


		while(indiceProcessos < qtdProcessos || escalonador.length > 0){ // enquanto não coloquei todos no escalonador ou não acabei de executar tudo

			var inseriu = false;
			eventosSRT[tempo] = [];

			while(indiceProcessos < qtdProcessos && processos[indiceProcessos].tempoChegada <= tempo){ // insere todos os processos que chegaram ate Tempo no escalonador
				escalonador.push(processos[indiceProcessos]);
				eventosSRT[tempo].push(str_pid + processos[indiceProcessos].id + str_add);
				indiceProcessos++;
				inseriu = true;
			}

			if(inseriu){
				escalonador.sort(cmpExec); // ordena escalonador por tempo de exec
				eventosSRT[tempo].push(str_reord);
			}

			if(escalonador.length > 0){

				var p = escalonador.shift();
				eventosSRT[tempo].push(str_pid + p.id + str_remov);
				p.tempoExecucao--;
				eventosSRT[tempo].push(str_pid + p.id + str_exe);

				infoSRT[tempo] = p.id;

				var id = busca(p.id);
				if(ultExec != id){
					processos[id].inicioSRT.push(tempo);
				}
				ultExec = id;
				processos[id].terminoSRT = tempo;

				// executei uma vez

				if(p.tempoExecucao > 0){
					escalonador.push(p); // devolvo para o escalonador
					eventosSRT[tempo].push(str_pid + p.id + str_add);
					escalonador.sort(cmpExec); // reordeno por exec
					eventosSRT[tempo].push(str_reord);
				}else {
					eventosSRT[tempo].push(str_pid + p.id + str_fim);
				}
			}


			tempo++;
		}
		somaTempo = Math.max(somaTempo, tempo);

		var somaAux = 0;
		for(var p of processos){
			somaAux += p.inicioSRT[p.inicioSRT.length-1];
		}

		mediaSRT = somaAux/qtdProcessos;

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
