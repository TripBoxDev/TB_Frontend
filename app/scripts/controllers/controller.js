function getGroup ($scope) {
  $scope.groups = [
    {id:1, name:'Miami', description:'País muy bonito pq lo digo yo'},
    {id:2, name:'Berlin', description:'Me encanta la cerveza negra'},
    {id:3, name:'Luxenburgo', description:'Aquí se te ha ido de las manos Correa xd'},
    {id:4, name:'Dublin', description:'Aquí se te ha ido de las manos Correa xd'},
    {id:5, name:'Amsterdam', description:'Aquí se te ha ido de las manos Correa xd'},
    {id:6, name:'Japon', description:'Aquí se te ha ido de las manos Correa xd'},
    {id:7, name:'Hawai', description:'Aquí se te ha ido de las manos Correa xd'}
  ];
}

//PETICION JSON HACIA LA API

//para hacer uso de $resource debemos colocarlo al crear el modulo
var app = angular.module("app", ["ngResource"]);
 
//con dataResource inyectamos la factoría
app.controller("appController", function ($scope, $http, dataResource) {
    //hacemos uso de $http para obtener los datos del json
    $http.get('data.json').success(function (data) {
        //Convert data to array.
        //datos lo tenemos disponible en la vista gracias a $scope
        $scope.datos = data;
    });
    //datosResource lo tenemos disponible en la vista gracias a $scope
    $scope.datosResource = dataResource.get();
})
 
//de esta forma tan sencilla consumimos con $resource en AngularJS
app.factory("dataResource", function ($resource) {
    return $resource("data.json", //la url donde queremos consumir
        {}, //aquí podemos pasar variables que queramos pasar a la consulta
        //a la función get le decimos el método, y, si es un array lo que devuelve
        //ponemos isArray en true
        { get: { method: "GET", isArray: true }
    })
})