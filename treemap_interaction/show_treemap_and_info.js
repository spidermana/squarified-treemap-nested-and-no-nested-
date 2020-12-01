var margin = {top: 30, right: 10, bottom: 10, left: 10},
width = 4445 - margin.left - margin.right,
height = 2445 - margin.top - margin.bottom;

var svg = d3.select("#vis_treemap")
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

                  
d3.json("https://raw.githubusercontent.com/spidermana/squarified-treemap-nested-and-no-nested-/main/treemap_interaction/files/China_data.json", function(data) {
  console.log(data)

var root = d3.hierarchy(data).sum(function(d){ return d.value})
console.log(root)


d3.treemap()
  .size([width, height])
  .paddingTop(35)        
  .paddingRight(20)
  .paddingInner(3)      
  //.paddingOuter(6)
  //.padding(20)
  (root)

  console.log(root)


var color = d3.scaleOrdinal(d3.schemeCategory20)
// And a opacity scale
var opacity = d3.scaleLinear()
  .domain([10, 90])   //value
  .range([.5,1])  //0.5~1的透明度


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
.attr("text",function(d){ return d.data.name})


svg
.selectAll("text")
.data(root.leaves())
.enter()
.append("text")
.text(function(d){ return d.data.name})
.attr("font-size", "20px")
.attr("fill", "white")
//.attr("x", function(d){ return d.x0+5})    
//.attr("y", function(d){ return d.y0+20})   
.attr("text-anchor","left")
.attr("transform", function(d){ if(d.x1 - d.x0 < d.y1-d.y0) return "translate("+(d.x0+8)+","+(d.y0+20)+")"+"rotate(90)"; else return  "translate("+(d.x0+8)+","+(d.y0+20)+")"+"rotate(0)";})
.style("visibility", function(d){ if((d.x1 - d.x0)/14 < d.data.name.length && ((d.y1 - d.y0)/14 < d.data.name.length)) return "hidden"; else return "visible";})


svg
  .selectAll("titles")
  .data(root.descendants().filter(function(d){return d.depth==1}))
  .enter()
  .append("text")
  .attr("x", function(d){ return d.x0})
  .attr("y", function(d){ return d.y0+20})
  .attr("font-weight","bold")
  .text(function(d){ return d.data.name })
  .attr("font-size", "25px")
  .attr("fill",  function(d){ return color(d.data.name)} )


svg
  .append("text")
  .attr("x", 0)
  .attr("y", 14)    // +20 to adjust position (lower)
  .text("Treemap Layout of Chinese Provinces(Part Of)")
  .attr("font-size", "50px")
  .attr("fill",  "orange" )
  .attr("font-family","Piedra")
  // create a tooltip
var tooltip = d3.select("#infowins")
          .append("div")
          .style("position", "absolute")
          .style("visibility", "hidden")
          .style("background-color", "#d52e3f")
          .style("border", "solid")
          .style("border-width", "2px")
          .style("border-radius", "7px")
          .style("padding", "10px")
          .html("<p>Info Windows:</p><img src='./china.png' width='150' height='60'></img>");


var oldcolor;
d3.selectAll("rect")
  .on("mouseover",function(){
      oldcolor = d3.select(this).style("fill");
      d3.select(this)
        .style("fill","rgb(0, 0, 0)");
      //console.log(d3.event);
      tooltip.style("visibility", "visible");
      //console.log(this);
      return;
  })
  .on("mousemove",function(){
     //console.log("MOVE",d3.event);
      tooltip.style("top", (d3.event.pageY+5)+"px")
              .style("left",(d3.event.pageX+5)+"px") 
              .html("<div class='title-wins'>Info Windows</div><br><span class='info-text'>The value of this city is "+Math.round(opacity.invert(this.style.opacity))+"<br></span><span class='info-text'>The name of this city is "+d3.select(this).attr("text")+"<br></span><img src='./china.png' width='250' height='260' style='margin:15px 70px'></img><br>");
      return;
    })
  .on("mouseout",function(){
        //console.log("OUT_EVENT",d3.select(d3.event.toElement)["_groups"][0]);
        //console.log("OUT",d3.event)
        d3.select(this)
        .style("fill",oldcolor);
        tooltip.style("visibility", "hidden");
        return;
  });
})