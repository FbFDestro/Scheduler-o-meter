$(document).ready(function(){
    
    var vetorTop, qtdProcessos;
    var processos = [];
    var somaTempo = 0;

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

	$(".btn").click(function(){
		
		qtdProcessos = parseInt($("input[name='qtdProcessos']").val());
	
        var tabela = $("textarea[name='tabelaVerdade']").val();

        if(tabela.length != 0){

        tabela = tabela.replace(/\s*\n/g,"/\n");
        vetorTop = tabela.replace( /\n/g," ").split(" ");
        
		for(var i = 0; i < vetorTop.length; i+=2){
            processos.push(criaObj(parseInt(i/2), parseInt(vetorTop[i]),parseInt(vetorTop[i+1])));
            var obj = processos[i/2];
            somaTempo += parseInt(vetorTop[i+1]);
            imprimeObj(obj);
        }
        alert(somaTempo);
        
        sjf();
        srtf();

        /*
		localStorage.setItem("qtdProcessos",qtdProcessos);
		localStorage.setItem("processos",processos);
        window.open("simulacao.html");
        */
        
    }else {
        alert("Complete os campos adequadamente");
    }        


    });
    
    function cmpSJF(a, b){
        if(a.tempoChegada == b.tempoChegada){
            if(a.tempoExecucao < b.tempoExecucao) return -1;
            if(a.tempoExecucao > b.tempoExecucao) return 1;
            if(a.tempoExecucao == b.tempoExecucao) return 0;
        }
        if (a.tempoChegada < b.tempoChegada) return -1;
        if (a.tempoChegada > b.tempoChegada) return 1;
    }

    function busca(id){
        for(var i=0;i<qtdProcessos;i++){
            if(processos[i].id == id) return i;
        }
        return -1; // não encontrou
    }
    
    function sjf(){
        processos.sort(cmpSJF);

        var tempo = 0;
        var indiceProcessos = 0;

        var escalonador = [];

        console.log(qtdProcessos + " " + escalonador.length);
        while(indiceProcessos < qtdProcessos || escalonador.length != 0){ // enquanto não coloquei todos os processos no escalonador e ainda não acabei de processar tudo

            console.log("wh");
            while(indiceProcessos < qtdProcessos && processos[indiceProcessos].tempoChegada <= tempo) {
                escalonador.push(processos[indiceProcessos]);
                indiceProcessos++;
            }
    
            if(escalonador.length != 0) { // se tem processos para executar
                var p = escalonador.shift();
                var id = busca(p.id);
                processos[id].inicioSJF = tempo;
                tempo += p.tempoExecucao;
                processos[id].terminoSJF = tempo;		
            }else { // se não tem processos, apenas incrementa no tempo
                tempo++;
            }
        }


        for (let i = 0; i < processos.length; i++) {
            imprimeObj(processos[i]);
        }

    }

    function srtf(){

    }


	
});