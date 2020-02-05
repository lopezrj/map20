import React, { Component } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import "./Map.css";
import ni from 'geodata/ni20.json';
import Departamentos from 'components/Departamentos';

class Map extends Component {
  render() {
    const ni_proj = d3.geoMercator();
    const pathGenerator = d3.geoPath().projection(ni_proj);
    
    ni_proj.scale(900 *10)
       .center([-85,13.65]);

    const municipios = topojson.feature(ni, ni.objects.municipios).features
      .map((d,i) => <path key={"path"+i} d={pathGenerator(d)} className="municipio" />);

  return (
    <svg width="900" height="900" >
      <Departamentos scale="9000" center={[-85,13.65]} className="departamento" />
      <g id="municipios">{municipios}</g>
    </svg>);
  }
}
export default Map; // Don’t forget to use export default!