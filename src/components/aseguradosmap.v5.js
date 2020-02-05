// Display municipios y departamentos
export function showDepartamentos(mapfile) {
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

export function showLegend() {
  
  const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(" + (150) + "," + (height - 150) + ")")
    .selectAll("g")
    .data([5e4, 1.5e5, 3e5,  5e5 ])
    .enter().append("g");
  
  legend.append("circle")
    .attr("cy", function(d) { return -radius(d); })
    .attr("r", radius);

  legend.append("text")
    .attr("y", function(d) { return -2 * radius(d); })
    .attr("dy", "1.3em")
    .text(d3.format(".1s"));
}

var scout = d3.select("#map-container").append("div")
  .attr("id","scout")
  .style("opacity", 0);

function setscoutHTML(d, year) {
  var fc = d3.format(",");
  var fp = d3.format(".2%");

  var html= "<strong>" + d.properties.name + " " 
            + year +"</strong><br/>"
            + "Asegurados: " + fc(pobById.get(d.id)) 
            + "<br/> Mujeres: " + fp(pctUrbana.get(d.id))
            + " " + fc(pobUrbana.get(d.id));
  return html ;
};


function showBubbles(year){

  d3.json(mapfile).then( function(ni) {
     svg.selectAll(".bubble").remove();
     svg.selectAll(".arc").remove();
     svg.selectAll(".labelYear").remove();

    var arc = d3.arc().innerRadius(0).outerRadius(10).startAngle(0).endAngle(1.5*Math.PI);

    const datafile =  "/data/asegurados.tsv";

    d3.tsv(datafile).then( data  => { 
      data = data.filter(function(d) { return +d.year ==  year; });
      pobById = d3.map();
      pctUrbana = d3.map();
      pobUrbana = d3.map();

      data.forEach(function(data) {
        pobById.set(data.mun_id, +data.T_n);
        pctUrbana.set(data.mun_id, +data.F_n/+data.T_n);
        pobUrbana.set(data.mun_id, +data.M_n);
      });

      var municipios = topojson.feature(ni, ni.objects.municipios).features
               .sort(function(a,b) { return pobById.get(b.id) - pobById.get(a.id)})

      labelYear(year);
  
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

    })  
  })
}

function  labelYear(year)  {
  const labelYear = svg.append("g")
    .attr("class","labelYear")
    .attr("transform", "translate(" + (100) + "," + (50) + ")");

  labelYear.append( "rect" )
    .attr("width","7.5em")
    .attr("height","50px")
    .attr("fill","white")
    .attr("stroke","steelblue")
    .attr("opacity",1);

   labelYear.append("text")
    .text(year)
    .attr("font-family", "sans-serif")
    .attr("font-weight", "bold")
    .attr("font-size", "40px")
    .attr("fill", "steelblue")
    .attr("dy", "1em")
    .attr("dx", "0.4em");



};


