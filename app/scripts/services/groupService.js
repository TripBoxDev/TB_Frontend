app.service('groupService', function(){

	//afegir totes les variables necessaries
	var group=null;

	return {
		getGroup:function(){
			return group;
		},
		setGroup: function(newGroup){
			group=newGroup; 
		}


	};
});