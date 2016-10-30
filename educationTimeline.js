var educs = [
{"id": "Classes prepa", "text": "CPGE" , "start": 2011, "end":2013 , "lane":0},
{"id": "ECN" , "text": "Ecole Centrale de Nantes", "start": 2013, "end":2017, "lane":1},
{"id": "DTU" , "text": "DTU", "start": 2015, "end":2017, "lane":2},
{"id": "KAIST" , "text": "KAIST", "start": 2016, "end":2017, "lane":3},
{"id": "Perso" , "text": "Personal projects", "start": 2014, "end":2017, "lane":4}
]



function drawEducationTimeline(divID){

    var element = document.getElementById(divID);
    var ww = element.clientWidth;
    var hh = element.clientHeight;
    var margin = 30;
    var timeBegin = 2011;
    var timeEnd = 2017;

    var x = d3.scale.linear()
        .domain([timeBegin, timeEnd])
        .range([margin, ww - margin]);

    var y = d3.scale.linear()
        .domain([0, educs.length])
        .range([margin, hh - margin]);

    var svg = d3.select("#" + divID).append("svg")
      .attr("width", ww)
      .attr("height", hh)
      .attr("class", "chart");



    for (var i=0; i<educs.length;i++){
      var d = educs[i];
      var l = svg.append("line")          // attach a line
        .style("stroke", nameToColor(d.id) )  // colour the line
        .style("stroke-width" , 2)
        .attr("x1", x(d.start))     // x position of the first end of the line
        .attr("y1", y(d.lane))      // y position of the first end of the line
        .attr("x2", x(d.end))     // x position of the second end of the line
        .attr("y2", y(d.lane));
      svg.append("text")
         .attr("y", y(d.lane) - 3 )//magic number here
         .attr("x", function(){ return x(0.5*(d.start + d.end))})
         .attr('text-anchor', 'middle')
         .attr("class", "myLabel")//easy to style with CSS
         .attr("fill", nameToColor(d.id) )
         .text(d.text);
    }

    var xAxis = d3.svg.axis()
                  .orient("bottom")
                  .ticks(2017-2011)
                  .scale(x)
                  .tickFormat(d3.format("d"));

    var xAxisGroup = svg.append("g").attr("class", "axis")
      .attr("transform", "translate(0," + (hh - margin) + ")")
      .call(xAxis);


}