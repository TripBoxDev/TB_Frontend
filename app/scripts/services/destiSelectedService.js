app.service('destiSelectedService', function(){

	//afegir totes les variables necessaries
	var service=null;

	return {
		getDesti:function(){
			return service;
		},
		setDesti: function(newServie){
			service=newServie;
		}


	};
});