import React, { Component } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import "./Map.css";
import ni from 'geodata/ni20.json';

class Map extends Component {
  render() {
    const DATA = [32, 57, 112, 293];
    const ni_proj = d3.geoMercator();
    const pathGenerator = d3.geoPath().projection(ni_proj);
    
    ni_proj.scale(900 *10)
       .center([-85,13.65]);
    const departamentos = topojson.feature(ni, ni.objects.departamentos).features
      .map((d,i) => <path key={"path"+i} d={pathGenerator(d)} className="departamento" />);

    const municipios = topojson.feature(ni, ni.objects.municipios).features
      .map((d,i) => <path key={"path"+i} d={pathGenerator(d)} className="municipio" />);

  return (<svg width="900" height="900" >{departamentos}{municipios}
  { DATA.map((o, i) => (
      <circle
        key={i}
        cx={(i * 100) + 30}
        cy="60"
        r={Math.sqrt(o)}
        style={{ fill: 'steelblue' }}
      />
    ))}
  </svg>);
  }
}
export default Map; // Don’t forget to use export default!