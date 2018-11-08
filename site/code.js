$(document).ready(function(){
    
    var vetorTop, qtdProcessos;
    var processos = [];
    var infoSJF = {}, infoSRT = {};
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
	
        var tabela = $("textarea[name='tabelaProcessos']").val();

        if(tabela.length != 0){

        tabela = tabela.replace(/\s*\n/g,"/\n");
        vetorTop = tabela.replace( /\n/g," ").split(" ");
        
		for(var i = 0; i < vetorTop.length; i+=2){
            processos.push(criaObj(parseInt(i/2), parseInt(vetorTop[i]),parseInt(vetorTop[i+1])));
            var obj = processos[i/2];
           //imprimeObj(obj);
        }
        
        sjf();
        srtf();

        
		localStorage.setItem("qtdProcessos",qtdProcessos);
		localStorage.setItem("infoSJF",JSON.stringify(infoSJF));
        localStorage.setItem("infoSRT",JSON.stringify(infoSRT));
        localStorage.setItem("somaTempo",somaTempo);
        window.open("simulacao.html");
        
    }else {
        alert("Complete os campos adequadamente");
    }        


    });
    
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
    
    function sjf(){
        processos.sort(cmpChegada);

        var tempo = 0;
        var indiceProcessos = 0;

        var escalonador = [];

        console.log(qtdProcessos + " " + escalonador.length);
        while(indiceProcessos < qtdProcessos || escalonador.length != 0){ // enquanto não coloquei todos os processos no escalonador e ainda não acabei de processar tudo

            console.log("wh");
            while(indiceProcessos < qtdProcessos && processos[indiceProcessos].tempoChegada <= tempo) {
                escalonador.push(processos[indiceProcessos]);
                escalonador.sort(cmpExec);
                indiceProcessos++;
            }
    
            if(escalonador.length != 0) { // se tem processos para executar
                var p = escalonador.shift();
                var id = busca(p.id);
                processos[id].inicioSJF = tempo;
                for(var i = tempo; i < tempo + p.tempoExecucao; i++){
                    infoSJF[i] = p.id;
                   // console.log(id);
                   // console.log(infoSJF[i]);
                }
                tempo += p.tempoExecucao;
                processos[id].terminoSJF = tempo;		
            }else { // se não tem processos, apenas incrementa no tempo
                tempo++;
            }
        }
        somaTempo = tempo;
        console.log(somaTempo);
        console.log(infoSJF);

        for (let i = 0; i < processos.length; i++) {
          //  imprimeObj(processos[i]);
        }

        for(var i=0;i <= somaTempo; i++){
            if(infoSJF[i] !== undefined)
                console.log(infoSJF[i]);
        }

    }

    function srtf(){

        processos.sort(cmpChegada); 


        var tempo = 0;
        var indiceProcessos = 0;
    
        var escalonador = [];
        var idUltimoEx = -1;
        alert("comp");
    
        while(indiceProcessos < qtdProcessos || escalonador.length != 0){ // enquanto não coloquei todos os processos no escalonador e ainda não acabei de processar tudo
            console.log("wh2");
            var p;
            var tirou = false;
            if(escalonador.length != 0) { // se tem processos para executar
                p = escalonador.shift();
                escalonador.sort(cmpExec);
                tirou = true;
            }
    
            while(indiceProcessos < qtdProcessos && processos[indiceProcessos].tempoChegada <= tempo) {
                //printf("no tempo %d: inseriu o %d com %d na fila\n",tempo, processos[indiceProcessos].id, processos[indiceProcessos].tempoExecucao);
                if(!tirou){
                    p = processos[indiceProcessos];
                    tirou = true;
                }else {
                    escalonador.push(processos[indiceProcessos]);
                    escalonador.sort(cmpExec);
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
                if(p.tempoExecucao > 0) {
                    escalonador.push(p);
                    escalonador.sort(cmpExec);
                    //printf("no tempo %d: colocou %d, que tem %d de execucao restante\n",tempo,p.id, p.tempoExecucao);
                }
                infoSRT[tempo] = p.id;
                tempo++;
                processos[id].terminoSRT = tempo;		
            }else { // se não tem processos, apenas incrementa no tempo
                tempo++;
            }
        }

        console.log(infoSRT);

        for(var i=0;i <= somaTempo; i++){
            if(infoSRT[i] !== undefined)
                console.log(infoSRT[i]);
        }

        alert("rola");


    }


	
});