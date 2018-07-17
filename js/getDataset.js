$(document).ready(function(){
	config();
});

$('.btn').on('click', function(){
	event.preventDefault();
	config();
});

function config(){
	let base = $('[name="base"]:checked').val();
	let url = (base == "producao") ? "http://ecp.fluigcloud.com.br/api/public/ecm/dataset/search" : "http://ecp-teste.fluigcloud.com.br/api/public/ecm/dataset/search";

	let chaves = (base == "producao") ? {
		chave1: "6a484a706c75454876204e2831",//consumer key
		chave2: "6973272b544720516b276f3d6a",//consumer secret
		token1: "58e9c76d-3064-4f06-a85d-793a525132f1",//Access Token
		token2: "c9633700-9d21-4614-b006-00a9a2a6f21710414238-a6e4-4733-a5c1-4aeb60c65a5f"//Token Secret
	} : {
		chave1: "9B8AF60C44C5D531A1FEC22F64CCC78A",
		chave2: "F3B779B22C67187A654FA81C20B1CC09AE584F45AD57044F44109DA640B2BBEB",
		token1: "8662cd94-3a66-4eef-83d8-0cd61241ba70",
		token2: "99c7b0f6-ee81-403d-aea5-5582897183903e94fa2e-3b4b-42e2-9ed1-78bc68640a0c"
	}

	buscaDataset(url, chaves);
}

function buscaDataset(url, chaves){
	//Autentica o app
	var oauth = OAuth({
		consumer: {
			key: chaves.chave1,
			secret: chaves.chave2
		},
		signature_method: 'HMAC-SHA1',//Metodo selecionado no cadastro do app
		hash_function: function(base_string, key) {//criptografa os dados
			return CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64);
		},
		nonce_length: 6
	});
	
	//Dados da requisição
	var requisicao = {
		url: url,
		method: 'GET', //Metodo da requisição
		data: {
			datasetId: 'colleague' //Id do dataset a ser pesquisado
		}
	};
	
	//Token do app
	var token = {
		key: chaves.token1,
		secret: chaves.token2
	};

	$.ajax({
		url: requisicao.url,
		crossDomain: true,
		async: true,
		type: requisicao.method,    	
		data: oauth.authorize(requisicao, token)//faz a requisição e leva a chave pra verificação
	}).done(function(data) {
		gerarTBL(data);
	});
}

function gerarTBL(dados){
	if(dados.content.length > 0){
		let div = document.getElementById('tbl');
		div.innerHTML = "";

		let tbl = document.createElement('TABLE');

		tbl.classList.add('table', 'table-striped');

		let thead = document.createElement('THEAD');
		let tbody = document.createElement('TBODY');

		let trHead = document.createElement('TR');
		let thId = document.createElement('TH');
		let thNome = document.createElement('TH');
		let thMail = document.createElement('TH');

		thId.textContent = 'ID';
		thNome.textContent = 'Nome';
		thMail.textContent = 'e-mail';

		trHead.appendChild(thId);
		trHead.appendChild(thNome);
		trHead.appendChild(thMail);

		thead.appendChild(trHead);
		tbl.appendChild(thead);

		$.each(dados.content, function(x, y){
			let tr = document.createElement('TR');
			let colleagueId = document.createElement('TD');
			let colleagueName = document.createElement('TD');
			let mail = document.createElement('TD');

			colleagueId.textContent = y.colleagueId;
			colleagueName.textContent = y.colleagueName;
			mail.textContent = y.mail;

			tr.appendChild(colleagueId);
			tr.appendChild(colleagueName);
			tr.appendChild(mail);

			tbody.appendChild(tr);
		});

		tbl.appendChild(tbody);
		div.appendChild(tbl);
	} else {

	}
}