import React, { Component } from 'react'
import * as d3 from 'd3';
import * as topojson from 'topojson';
import "./Asegurados.css";
import ni from 'geodata/ni20.json';
import datafile from "data/asegurados.tsv";
import Departamentos from "components/Departamentos";


const ni_proj = d3.geoMercator();
const pathGenerator = d3.geoPath().projection(ni_proj);

const r = d3.scaleSqrt();

ni_proj.scale(900 * 10)
  .center([-85,13.65]);
  

class Municipios extends Component {
  render () {
    const municipios = topojson.feature(ni, ni.objects.municipios).features
    .map((d,i) => <path key={"path"+i} d={pathGenerator(d)} className={this.props.className} />); 
    return (
      <g id="municipios">{municipios}</g>)
  } 
}


function scout(status) {
  if (status===1) {
    d3.select("#map-container").append("div")
      .html("Al")
      .attr("id","scout")
      .style("opacity", 0)}

}

function Circles(props) {
  const circles = topojson.feature(ni, ni.objects.municipios).features
    .sort(function(a,b) { return props.data.get(b.properties.Munic_id) - props.data.get(a.properties.Munic_id)})
    .map((d,i) => 
      <circle key={i}
        transform= {"translate(" + pathGenerator.centroid(d) + ")"}
        r={r(props.data.get(d.properties.Munic_id)/100)} 
        onMouseOver = {console.log({i})}
        onMouseOut = {scout(0)}
         />);

  return (<g id="circles" className="bubble" >{circles}</g>); 
}  


class Asegurados extends Component {
  constructor(props) {
    super(props);
    this.state = {radius: 8, data: d3.map()};
  }

  componentDidMount() {
    const year = 2019
    var pob = d3.map();
    d3.tsv(datafile).then( data  => { 
      data = data.filter(function(d) { return +d.year ===  year; });
      data.forEach(function(data) {
        pob.set(data.mun_id, +data.T_n);
      });
      this.setState({data: pob})
      });
  }

  render() {
    return (
      <div id="map-container">
        <svg width="900" height="900" id="my-svg" viewBox="0 0 900 900" >
          <Departamentos scale="9000" center={[-85,13.65]} className="land" />
          <Circles className="circle" r={this.state.radius} data={this.state.data} />
        </svg>
      </div>
    )
  }
}

export default Asegurados
