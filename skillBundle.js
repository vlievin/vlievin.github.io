data = [
{"name":"Classes prepa.mathematics","size":1,"imports":[]},
{"name":"Classes prepa.physics","size":1,"imports":["Classes prepa.mathematics"]},
{"name":"ECN.economy","size":1,"imports":["ECN.Engineering mathematics", "Classes prepa.mathematics"]},
{"name":"ECN.Engineering mathematics","size":1,"imports":["Classes prepa.mathematics"]},
{"name":"ECN.Continuum physics","size":1,"imports":["Classes prepa.mathematics","ECN.Engineering mathematics","Classes prepa.physics"]},
{"name":"ECN.Fluid Mechanics","size":1,"imports":["Classes prepa.mathematics","ECN.Engineering mathematics","Classes prepa.physics" , "ECN.Continuum physics"]},
{"name":"ECN.C++","size":1,"imports":["ECN.Algorithms and programming"]},
{"name":"ECN.OpenGL","size":1,"imports":["ECN.C++"]},
{"name":"ECN.virtual Reality","size":1,"imports":["ECN.C++","ECN.OpenGL", "Classes prepa.mathematics","Classes prepa.physics" ]},
{"name":"ECN.Augmented Reality","size":1,"imports":["ECN.C++","ECN.OpenGL"]},
{"name":"ECN.Scientific Visualization","size":1,"imports":["ECN.C++","ECN.OpenGL", "Classes prepa.mathematics"]},
{"name":"ECN.Information Systems","size":1,"imports":[]},
{"name":"ECN.Algorithms and programming","size":1,"imports":["ECN.C++"]},


{"name":"DTU.python","size":1,"imports":["ECN.C++", "ECN.Algorithms and programming"]},
{"name":"DTU.cognitive science","size":1,"imports":["ECN.Engineering mathematics", "Classes prepa.mathematics"]},
{"name":"DTU.cognitive modelling","size":1,"imports":["DTU.cognitive science" ,"ECN.Engineering mathematics", "Classes prepa.mathematics", "DTU.python" ]},
{"name":"DTU.Social Graphs","size":1,"imports":["DTU.python", "Classes prepa.mathematics","ECN.Engineering mathematics", "DTU.Natural Language Processing", "ECN.Scientific Visualization" ]},
{"name":"DTU.Natural Language Processing","size":1,"imports":["DTU.python"]},
{"name":"DTU.Tools for Big Data","size":1,"imports":["DTU.python", "Classes prepa.mathematics","ECN.Engineering mathematics", "ECN.Algorithms and programming"]},
{"name":"DTU.High Performance Computing","size":1,"imports":["DTU.CUDA", "ECN.C++", "Classes prepa.mathematics","ECN.Engineering mathematics", "ECN.Algorithms and programming"]},
{"name":"DTU.CUDA","size":1,"imports":[ "ECN.C++"]},
{"name":"DTU.UX Design Prototyping","size":1,"imports":[]},
//{"name":"DTU.Innovation and digital media","size":1,"imports":[]},

{"name":"KAIST.Data Mining","size":50,"imports":["DTU.python","Classes prepa.mathematics","ECN.Engineering mathematics", "ECN.Algorithms and programming", "ECN.Scientific Visualization"]},
{"name":"KAIST.Ubiquitious Computing","size":1,"imports":["KAIST.Android Programming","KAIST.Data Mining"]},
{"name":"KAIST.Android Programming","size":1,"imports":["KAIST.Java", "DTU.UX Design Prototyping"]},
{"name":"KAIST.Java","size":1,"imports":["ECN.Algorithms and programming", "ECN.C++"]},
{"name":"KAIST.Hadoop","size":1,"imports":["ECN.Algorithms and programming", "KAIST.Java","DTU.Tools for Big Data"]},
{"name":"KAIST.Analytical Methodologies for Big Data","size":1,"imports":["KAIST.Java", "DTU.Tools for Big Data", "KAIST.Hadoop"]},
{"name":"KAIST.Social Computing Systems","size":1,"imports":["KAIST.Ubiquitious Computing","KAIST.Data Mining", "DTU.Social Graphs"]},
{"name":"KAIST.Web Technologies (HTML/CSS/Js/XML)","size":1,"imports":["ECN.Algorithms and programming", "ECN.Information Systems"]},

{"name":"Perso.Deep Learning","size":2,"imports":["Perso.Tensorflow", "DTU.python", "KAIST.Data Mining", "Classes prepa.mathematics","ECN.Engineering mathematics" , "DTU.Tools for Big Data", "KAIST.Analytical Methodologies for Big Data", "KAIST.Data Mining"]},
{"name":"Perso.Flask","size":1,"imports":["DTU.python", "KAIST.Web Technologies (HTML/CSS/Js/XML)"]},
{"name":"Perso.Tensorflow","size":3,"imports":["DTU.python"]}
// {"name":"economy","size":3812,"imports":["maths"]},
// {"name":"programming","size":3812,"imports":[""]},
// {"name":"OpenGL","size":3812,"imports":["programming"]},
// {"name":"virtualReality","size":3812,"imports":["OpenGL", "programming"]},
]

function drawBundleSkills(divID){

  var element = document.getElementById(divID);
  var ww = element.clientWidth;
  var hh = element.clientHeight;
  console.log(ww);
  console.log(hh);
  var diameter = (ww > hh ? hh : ww);

  var radius = diameter / 2,
      innerRadius = diameter / 4 - 50;

  var cluster = d3.layout.cluster()
      .size([360, innerRadius])
      .sort(null)
      .value(function(d) { return d.size; });

  var bundle = d3.layout.bundle();

  var line = d3.svg.line.radial()
      .interpolate("bundle")
      .tension(.95)
      .radius(function(d) { return d.y; })
      .angle(function(d) { return d.x / 180 * Math.PI; });

  var svg = d3.select("#" + divID).append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
    .append("g")
      .attr("transform", "translate(" + radius + "," + radius + ")");

  var link = svg.append("g").selectAll(".link"),
      node = svg.append("g").selectAll(".node");

  var classes = data;

  var nodes = cluster.nodes(packageHierarchy(classes)),
      links = packageImports(nodes);

  link = link
      .data(bundle(links))
    .enter().append("path")
      .each(function(d) { d.source = d[0], d.target = d[d.length - 1]; })
      .attr("class", "link")
      .attr("d", line);

  node = node
      .data(nodes.filter(function(n) { return !n.children; }))
    .enter().append("text")
      .attr("class", "node")
      .attr("dy", ".31em")
      .style("font-size", function(d) { d.size * 12 +"px"; })
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
      .style("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
      .text(function(d) { return d.key; })
      .on("mouseover", mouseovered)
      .on("mouseout", mouseouted);

  function mouseovered(d) {
    node
        .each(function(n) { n.target = n.source = false; });

    link
        .classed("link--target", function(l) { if (l.target === d) return l.source.source = true; })
        .classed("link--source", function(l) { if (l.source === d) return l.target.target = true; })
      .filter(function(l) { return l.target === d || l.source === d; })
        .each(function() { this.parentNode.appendChild(this); });

    node
        .classed("node--target", function(n) { return n.target; })
        .classed("node--source", function(n) { return n.source; });
  }

  function mouseouted(d) {
    link
        .classed("link--target", false)
        .classed("link--source", false);

    node
        .classed("node--target", false)
        .classed("node--source", false);
  }

  d3.select(self.frameElement).style("height", diameter + "px");

  // Lazily construct the package hierarchy from class names.
  function packageHierarchy(classes) {
    var map = {};

    function find(name, data) {
      var node = map[name], i;
      if (!node) {
        node = map[name] = data || {name: name, children: []};
        if (name.length) {
          node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
          node.parent.children.push(node);
          node.key = name.substring(i + 1);
        }
      }
      return node;
    }

    classes.forEach(function(d) {
      find(d.name, d);
    });

    return map[""];
  }

  // Return a list of imports for the given array of nodes.
  function packageImports(nodes) {
    var map = {},
        imports = [];

    // Compute a map from name to node.
    nodes.forEach(function(d) {
      map[d.name] = d;
    });

    // For each import, construct a link from the source to target node.
    nodes.forEach(function(d) {
      if (d.imports) d.imports.forEach(function(i) {
        imports.push({source: map[d.name], target: map[i]});
      });
    });

    return imports;
  }
}