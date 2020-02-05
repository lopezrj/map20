import React, { Component } from 'react'
import * as d3 from 'd3';
import * as topojson from 'topojson';
import "./Asegurados.css";
import ni from 'geodata/ni20.json';

class Departamentos extends Component {
    render() {
        const ni_proj = d3.geoMercator();
        const pathGenerator = d3.geoPath().projection(ni_proj);
        
      ni_proj.scale(this.props.scale)
        .center(this.props.center);
      const departamentos = topojson.feature(ni, ni.objects.departamentos).features
        .map((d,i) => <path key={"path"+i} d={pathGenerator(d)} className={this.props.className} />); 
      return (
        <g id="departamentos">{departamentos}</g>
      ) 
    }
}

export default Departamentos
