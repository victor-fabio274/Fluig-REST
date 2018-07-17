$(document).ready(function(){
	var oauth = OAuth({
		consumer: {
			key: 'chaveCadastradaNoFluig',
			secret: 'chaveSecretaCadastradaNoFluig'
		},
		signature_method: 'HMAC-SHA1',
		hash_function: function(base_string, key) {
			return CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64);
		},
		nonce_length: 6
	});
	
	//Dados da requisição
	var requisicao = {
		url: "http://dominioDoSeuFluig.com.br/api/public/ecm/dataset/search",
		method: 'GET', 
		data: {
			datasetId: 'id_do_dataset' 
		}
	};
	
	//Token do app
	var token = {
		key: 'token_gerado_pelo_fluig',
		secret: 'secret_token_gerado'
	};

	$.ajax({
		url: "http://dominioDoSeuFluig.com.br/api/public/ecm/dataset/search",
		crossDomain: true,
		async: true,
		type: requisicao.method,    	
		data: oauth.authorize(requisicao, token)
	}).done(function(data) {
		console.log(data);
	});
});
