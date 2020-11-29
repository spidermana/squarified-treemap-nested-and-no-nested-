// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
width = 445 - margin.left - margin.right,
height = 445 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");
          
// read json data
d3.json("https://raw.githubusercontent.com/spidermana/squarified-treemap-nested-and-no-nested-/main/treemap_interaction/files/data.json", function(data) {
  console.log(data)
// Give the data to this cluster layout:
var root = d3.hierarchy(data).sum(function(d){ return d.value}) // Here the size of each leave is given in the 'value' field in input data
console.log(root)
// Then d3.treemap computes the position of each element of the hierarchy
d3.treemap()
  .size([width, height])
  .paddingTop(28)         //由于padding的缘故，显示出来的每个框都不止那么大。
  .paddingRight(7)
  .paddingInner(3)      // Padding between each rectangle
  //.paddingOuter(6)
  //.padding(20)
  (root)

// prepare a color scale
var color = d3.scaleOrdinal() //字符串和值的映射
  .domain(["boss1", "boss2", "boss3"])
  .range([ "#402D54", "#D18975", "#8FD175"])

// And a opacity scale
var opacity = d3.scaleLinear()
  .domain([10, 30])   //value
  .range([.5,1])  //0.5~1的透明度

// use this information to add rectangles:
svg
.selectAll("rect")
.data(root.leaves())
.enter()
.append("rect")
.attr('x', function (d) { return d.x0; })
.attr('y', function (d) { return d.y0; })
.attr('width', function (d) { return d.x1 - d.x0; })
.attr('height', function (d) { return d.y1 - d.y0; })
.style("stroke", "black")
.style("fill", function(d){ return color(d.parent.data.name)}) 
.style("opacity", function(d){ return opacity(d.data.value)})

// and to add the text labels
svg
.selectAll("text")
.data(root.leaves())
.enter()
.append("text")
.attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
.attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
.text(function(d){ return d.data.name.replace('mister_','') })
.attr("font-size", "19px")
.attr("fill", "white")

// and to add the text labels
svg
.selectAll("vals")
.data(root.leaves())
.enter()
.append("text")
.attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
.attr("y", function(d){ return d.y0+35})    // +20 to adjust position (lower)
.text(function(d){ return d.data.value })
.attr("font-size", "11px")
.attr("fill", "white")

// Add title for the 3 groups
svg
.selectAll("titles")
.data(root.descendants().filter(function(d){return d.depth==1}))
.enter()
.append("text")
.attr("x", function(d){ return d.x0})
.attr("y", function(d){ return d.y0+21})
.text(function(d){ return d.data.name })
.attr("font-size", "19px")
.attr("fill",  function(d){ return color(d.data.name)} )

// Add title for the 3 groups
svg
.append("text")
.attr("x", 0)
.attr("y", 14)    // +20 to adjust position (lower)
.text("Three group leaders and 14 employees")
.attr("font-size", "19px")
.attr("fill",  "grey" )
  // create a tooltip
var tooltip = d3.select("#infowins")
          .append("div")
          .style("position", "absolute")
          .style("visibility", "hidden")
          .style("background-color", "white")
          .style("border", "solid")
          .style("border-width", "1px")
          .style("border-radius", "5px")
          .style("padding", "10px")
          .html("<p>Info Windows:</p><img src='https://cve.mitre.org/images/cvebanner.png' width='150' height='60'></img>");


var oldcolor;
d3.selectAll("rect")
  .on("mouseover",function(){
      oldcolor = d3.select(this).style("fill");
      d3.select(this)
        .style("fill","rgb(0, 0, 0)");
      console.log(d3.event);
      tooltip.style("visibility", "visible");
      console.log(this);
  })
  .on("mousemove",function(){
      console.log(d3.event);
      d3.select(this)
      tooltip.style("top", (event.pageY)+"px").style("left",(event.pageX)+"px");
      tooltip.html("<p>Info Windows:</p><img src='https://cve.mitre.org/images/cvebanner.png' width='150' height='60'></img><br> The value is "+opacity.invert(this.style.opacity)+"<br><span style='font-size: 40px;'></span>");
  })
  .on("mouseout",function(){
        console.log(d3.event);
        d3.select(this)
        .style("fill",oldcolor);
        tooltip.style("visibility", "hidden");
  });
})