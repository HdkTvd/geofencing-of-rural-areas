var platform = new H.service.Platform({
    apikey: "SwDJ59x3TPwJ50nKgrdw1mK_yU0t4NbxEZXw0MaP4gw"
  });
  var maptypes = platform.createDefaultLayers();

 
 var map = new H.Map(document.getElementById('map'), maptypes.vector.normal.map, {
   center: {lat: 19.15, lng: 72.99},
   zoom: 10
 });
  // Enable the event system on the map instance:
var mapEvents = new H.mapevents.MapEvents(map);

// Instantiate the default behavior, providing the mapEvents object:
new H.mapevents.Behavior(mapEvents);
  
// Create the default UI components
//   var ui = H.ui.UI.createDefault(map, defaultLayers);
var arr = document.getElementById('coord').innerHTML.split(',');
console.log(arr);
for(i = 0; i < arr.length ; i+=2){
  var temp = arr[i];
  arr[i] = arr[i+1];
  arr[i+1] = temp;
}
console.log(arr);
// string_list = ["19.15","72.99","19.3","73","19.3","73.2","19.15","72.99"]
int_list =[]
for(var i=0;i<arr.length;i++)
{
    int_list.push(parseFloat(arr[i]))
}
console.log(int_list)
const lineString = new H.geo.LineString();
for(var i=0; i<int_list.length ; i+=2)
{
    lineString.pushPoint({lat : int_list[i] ,lng: int_list[i+1]});
}  
const polygon = new H.map.Polygon(lineString);
map.addObject(polygon);