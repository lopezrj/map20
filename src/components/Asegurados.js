import React, { Component } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import "./Asegurados.css";
import ni from 'geodata/ni20.json';
import datafile from "data/asegurados.tsv";

const pobById = d3.map();
const pctUrbana = d3.map();
const pobUrbana = d3.map();
var year = 2019;

const width = 900;
const height = 900;

var svg = d3.select("#map-container")
    .append("div")
     // Container class to make it responsive.
     .classed("svg-container", true) 
     .append("svg")
     // Responsive SVG needs these 2 attributes and no width and height attr.
     .attr("preserveAspectRatio", "xMinYMin meet")
     .attr("viewBox", "0 0 " + width + " " + height)
     // Class to make it responsive.
     .classed("svg-content-responsive", true)
    .attr("width", width)
    .attr("height", height);


// FUNCTIONS

var radius = d3.scaleSqrt()
  .domain([0, 1e6]) 
  .range([0, 50]);



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

var projection = d3.geoMercator().center([-85.5,13.65])
  .scale(900*10)
  .translate([width/2,height/3]);

var path = d3.geoPath()
  .projection(projection);

  const svg = d3.select("#my-svg");

  var map = svg.append("g")
      .attr("id","map");

     svg.selectAll(".bubble").remove();
     svg.selectAll(".arc").remove();
     svg.selectAll(".labelYear").remove();

    var arc = d3.arc().innerRadius(0).outerRadius(10).startAngle(0).endAngle(1.5*Math.PI);

    d3.tsv(datafile).then( data  => { 
      data = data.filter(function(d) { return +d.year ===  year; });

      data.forEach(function(data) {
        pobById.set(data.mun_id, +data.T_n);
        pctUrbana.set(data.mun_id, +data.F_n/+data.T_n);
        pobUrbana.set(data.mun_id, +data.M_n);
      });

      var municipios = topojson.feature(ni, ni.objects.municipios).features
               .sort(function(a,b) { return pobById.get(b.Munic_id) - pobById.get(a.Munic_id)})
  
      map.append("g")
        .attr("class", "arcs")
        .selectAll(".arc")
          .data(municipios)
          .enter().append("path")
          .attr("class","arc")
          .attr("d", arc
                     .outerRadius(function(d) { return radius(pobById.get(d.Munic_id)); })
                     .endAngle(function(d) { return 2*Math.PI*pctUrbana.get(d.Munic_id); })
                )
          .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; });
      
      map.append("g")
        .attr("class", "bubble")
        .selectAll("circle")
          .data(municipios)
          .enter().append("circle")
          .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
 //         .attr("r", function(d) { return d3.scaleSqrt(pobById.get(d.Munic_id)); })
          .attr("r", function(d) { return 8; })
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
}



class Asegurados extends Component {
  constructor(props) {
    super(props);
    this.state = {pobById: d3.map()};
}

componentDidMount() {

 // showBubbles(year);
  d3.tsv(datafile).then( data  => { 
    data = data.filter(function(d) { return +d.year ===  year; });
    data.forEach(function(data) {
      pobById.set(data.mun_id, +data.T_n);
      pctUrbana.set(data.mun_id, +data.F_n/+data.T_n);
      pobUrbana.set(data.mun_id, +data.M_n);
    });
    this.setState({ pobById: pobById})

  });  
  this.labelYear(2019); 
  this.showLegend();

};

  showLegend() {
    const legend = d3.select("#my-svg").append("g")
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
  };

  labelYear(year) {
    const l = d3.select("#my-svg").append("g")
    l.attr("class","labelYear")
    .attr("transform", "translate(" + (100) + "," + (50) + ")")
    l.append( "rect" )
    .attr("width","7.5em")
    .attr("height","50px")
    .attr("fill","white")
    .attr("stroke","steelblue")
    .attr("opacity",1)

    l.append("text")
    .text(year)
    .attr("font-family", "sans-serif")
    .attr("font-weight", "bold")
    .attr("font-size", "40px")
    .attr("fill", "steelblue")
    .attr("dy", "1em")
    .attr("dx", "0.4em")
  };


  render() {

    const ni_proj = d3.geoMercator();
    const pathGenerator = d3.geoPath().projection(ni_proj);

    ni_proj.scale(900 * 10)
      .center([-85,13.65]);
  
    const departamentos = topojson.feature(ni, ni.objects.departamentos).features
      .map((d,i) => <path key={"path"+i} d={pathGenerator(d)} className="land" />);

    const bubbles = topojson.feature(ni, ni.objects.municipios).features
      .map((d,i) => 
        <circle key={i}
        cx={pathGenerator.centroid(d)[0]}
        cy={pathGenerator.centroid(d)[1]}
       // r={d3.scaleSqrt(this.state.pobById.get(d.properties.Munic_id))}
         r={Math.sqrt(8)}
        style={{ fill: 'red' }} />);

    return (
      <div id="map-container">
        <svg width="900" height="900" id="my-svg" viewBox="0 0 900 900" >
          <g>{departamentos}</g>
          <g>{bubbles}</g>
        </svg>
      </div>
    )
  }
}

export default Asegurados
