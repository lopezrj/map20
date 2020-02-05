// MAPA DE MUNICIPIOS Y DEPARTAMENTOS CON BURBUJAS POR MUNICIPIO
// USANDO D3 Version 5

const mapfile = "/geodata/ni.json";

const datafile =  "/data/poblacion.tsv";

var width = 800;
var height = 700;

var svg = d3.select("#map-container").append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.append("g");

g.append( "rect" )
  .attr("width",width)
  .attr("height",height)
  .attr("fill","white")
  .attr("opacity",0);

var map = g.append("g")
    .attr("id","map");

var radius = d3.scaleSqrt()
    .domain([0, 1e6])
    .range([0, 50]);

var projection = d3.geoMercator().center([-85.5,13.65])
    .scale(width*10)
    .translate([width/2,height/3]);

var path = d3.geoPath()
    .projection(projection);

showLegend();
showDepartamentos(mapfile);

updateMunicipios(2017);


// Display municipios y departamentos
function showDepartamentos(mapfile) {
  d3.json(mapfile).then(function(ni) {
     // pinta los municipios as a feature
    var departamentos = topojson.feature(ni, ni.objects.departamentos).features;
    map.selectAll("path", ".departamento")
      .data(departamentos).enter()
      .append("path")
        .attr("vector-effect","non-scaling-stroke")
        .attr("class", "land")
        .attr("d", path);
  })
}

// FUNCTIONS


function showLegend() {
  
  var legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(" + (150) + "," + (height - 150) + ")")
    .selectAll("g")
    .data([5e4, 1.5e5, 3e5,1e6 ])
    .enter().append("g");
  
  legend.append("circle")
    .attr("cy", function(d) { return -radius(d); })
    .attr("r", radius);

  legend.append("text")
    .attr("y", function(d) { return -2 * radius(d); })
    .attr("dy", "1.3em")
    .text(d3.format(".1s"));
}


function updateMunicipios(selectedYear) {

//  d3.select("#map-container").selectAll("#scout").remove();
  showBubbles(selectedYear);
}


function setscoutHTML(d, year){

  var fc = d3.format(",");
  var fp = d3.format(".2%");

  var html= "<strong>" + d.properties.name + " " 
            + year +"</strong><br/>"
            + "Hab: " + fc(pobById.get(d.id)) 
            + "<br/> Urbano: " + fp(pctUrbana.get(d.id))
            + " " + fc(pobUrbana.get(d.id));
  return html ;
}

function showBubbles(year){
 d3.json(mapfile).then( function(ni) {

     svg.selectAll(".bubble").remove();
     svg.selectAll(".arc").remove();
     svg.selectAll(".labelYear").remove();

    var arc = d3.arc().innerRadius(0).outerRadius(10).startAngle(0).endAngle(1.5*Math.PI);
 //   var year= 2008
    var alfa= "+d.pob"+year+"t";
    var beta= "+d.pob"+year+"ur/+d.pob"+year+"t";
    var gamma= "+d.pob"+year+"ur";

    var scout = d3.select("#map-container").append("div")
      .attr("id","scout")
      .style("opacity", 0);
      
    d3.tsv(datafile).then(function(d) { 
      pobById = d3.map();
      pctUrbana = d3.map();
      pobUrbana = d3.map();
      d.forEach(function(d) {
        pobById.set(d.id, eval(alfa));
        pctUrbana.set(d.id, eval(beta));
        pobUrbana.set(d.id, eval(gamma));
      });
      
     var municipios = topojson.feature(ni, ni.objects.municipios).features
               .sort(function(a,b) { return pobById.get(b.id) - pobById.get(a.id)})
  

      map.append("g")
        .attr("class", "arcs")
        .selectAll(".arc")
          .data(municipios)
          .enter().append("path")
          .attr("class","arc")
          .attr("d", arc
                     .outerRadius(function(d) { return radius(pobById.get(d.id)); })
                     .endAngle(function(d) { return 2*Math.PI*pctUrbana.get(d.id); })
                )
          .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; });
      
      map.append("g")
        .attr("class", "bubble")
        .selectAll("circle")
          .data(municipios)
          .enter().append("circle")
          .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
          .attr("r", function(d) { return radius(pobById.get(d.id)); })
          .on("mouseover",function(d){
             scout.html(setscoutHTML(d,year))
               .style("opacity" , .9)
               .style("display", "block")
               .style("top" , (d3.event.pageY - 80) + "px")
               .style("left" , (d3.event.pageX + 10) + "px");
           })
          .on("mouseout",function(){
             scout.style("display","none")
                  .style("opacity" , .9);
           });

       var labelYear = svg.append("g")
         .attr("class","labelYear")
         .attr("transform", "translate(" + (150) + "," + (50) + ")");

      labelYear.append( "rect" )
        .attr("width",50)
        .attr("height",40)
        .attr("fill","white")
        .attr("opacity",0)

      labelYear.append("text")
         .text(year)
         .attr("font-family", "sans-serif")
         .attr("font-weight", "bold")
         .attr("font-size", "40px")
         .attr("fill", "steelblue")
         .attr("dy", "1.3em")
         .attr("dx", "0.3em");

    })  
  })
}


