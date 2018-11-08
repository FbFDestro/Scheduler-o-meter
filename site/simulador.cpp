#include <bits/stdc++.h>
using namespace std;

#define INF 0x3f3f3f3f
#define pb push_back
#define ll long long
#define all(x) (x).begin(), (x).end()

typedef struct processo{

	int id, tempoChegada, tempoExecucao,inicioSJF, terminoSJF, inicioSRT, terminoSRT;

	bool operator<(const processo &b) const{
		if(tempoExecucao == b.tempoExecucao) return tempoChegada > b.tempoChegada;
		return tempoExecucao > b.tempoExecucao;
	}

}processo;

bool cmpId(processo a, processo b){
	return a.id < b.id;
}

bool cmp(processo a, processo b){
	if(a.tempoChegada == b.tempoChegada) return a.tempoExecucao < b.tempoExecucao;
	return a.tempoChegada < b.tempoChegada;
}


int n; // quantidade processos
vector<processo> processos;

int busca(int id){
	for(int i=0;i<n;i++){
		if(processos[i].id == id) return i;
	}
	return -1; // não encontrou
}


void sjf(){

	sort(all(processos), cmp);

	int tempo = 0;
	int indiceProcessos = 0;

	queue<processo> escalonador;

	while(indiceProcessos < n || !escalonador.empty()){ // enquanto não coloquei todos os processos no escalonador e ainda não acabei de processar tudo

		while(indiceProcessos < n && processos[indiceProcessos].tempoChegada <= tempo) {
			escalonador.push(processos[indiceProcessos]);
			indiceProcessos++;
		}

		if(!escalonador.empty()) { // se tem processos para executar
			processo p = escalonador.front();
			escalonador.pop();
			int id = busca(p.id);
			processos[id].inicioSJF = tempo;
			tempo += p.tempoExecucao;
			processos[id].terminoSJF = tempo;		
		}else { // se não tem processos, apenas incrementa no tempo
			tempo++;
		}
	}

	sort(all(processos), cmpId);

	printf("\n\nSJF\n\n");
	int soma = 0;
	for(int i=0;i<n;i++){
		processo p = processos[i];
		printf("id %3d chegada %3d execucao %3d inicio %3d termino %3d\n",p.id, p.tempoChegada,p.tempoExecucao,p.inicioSJF, p.terminoSJF);
		soma += p.inicioSJF;
	}
	printf("Tempo médio de espera %.2lf\n", (double)soma/n);

}

void srt(){

	sort(all(processos),cmp);

	int tempo = 0;
	int indiceProcessos = 0;

	priority_queue<processo> escalonador;
	int idUltimoEx = -1;

	while(indiceProcessos < n || !escalonador.empty()){ // enquanto não coloquei todos os processos no escalonador e ainda não acabei de processar tudo

		processo p;
		bool tirou = false;
		if(!escalonador.empty()) { // se tem processos para executar
			p = escalonador.top();
			escalonador.pop();
			tirou = true;
		}

		while(indiceProcessos < n && processos[indiceProcessos].tempoChegada <= tempo) {
			//printf("no tempo %d: inseriu o %d com %d na fila\n",tempo, processos[indiceProcessos].id, processos[indiceProcessos].tempoExecucao);
			if(!tirou){
				p = processos[indiceProcessos];
				tirou = true;
			}else {
				escalonador.push(processos[indiceProcessos]);
			}
			indiceProcessos++;
		}

		if(tirou) { // se tem processos para executar
			//printf("no tempo %d: tirou e executou %d, que tem %d de execucao restante\n",tempo,p.id, p.tempoExecucao);
			int id = busca(p.id);
			if(p.id != idUltimoEx){
				processos[id].inicioSRT = tempo;
			}
			idUltimoEx = p.id;
			p.tempoExecucao--;
			if(p.tempoExecucao > 0) {
				escalonador.push(p);
				//printf("no tempo %d: colocou %d, que tem %d de execucao restante\n",tempo,p.id, p.tempoExecucao);
			}
			tempo++;
			processos[id].terminoSRT = tempo;		
		}else { // se não tem processos, apenas incrementa no tempo
			tempo++;
		}
	}

	sort(all(processos), cmpId);

	printf("\n\nSRTF\n\n");
	int soma = 0;
	for(int i=0;i<n;i++){
		processo p = processos[i];
		printf("id %3d chegada %3d execucao %3d inicio %3d termino %3d\n",p.id, p.tempoChegada,p.tempoExecucao,p.inicioSRT, p.terminoSRT);
		soma += p.inicioSRT;
	}
	printf("Tempo médio de espera %.2lf\n", (double)soma/n);
}

int main(){

	printf("Insira a quantidade de processo: \n");
	scanf("%d",&n);

	printf("Insira os processos no formato: tempoChegada tempoExecucao\n");

	for(int i=0;i<n;i++){
		processo p;
		//printf("ID{%d} : ", i);
		p.id = i;
		scanf("%d %d",&p.tempoChegada, &p.tempoExecucao);
		processos.pb(p);
	}

	sjf();
	printf("\n\n");
	srt();

	return 0;
}

