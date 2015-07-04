var width = 1000,
    height = 500,
    radius = Math.min(width/2, height),
    popCount = 5,
    color = d3.scale.category10();

var svg = d3.select("body")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height + ")");

var data = []
for (i=1; i <= Math.floor((Math.random() * 8) + 3); i++) {
  data.push({ "key": i, "count": 1});
}

function keyFn(d) {
    return d.key;
}

function countFn(d) {
    return d.count;
}

var pie = d3.layout.pie()
    .value(countFn)
    .sort(function(d) {
        return -keyFn(d);
    })
    .startAngle(-Math.PI/2)
    .endAngle(Math.PI/2)
    .padAngle(Math.PI/120);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(300);

function win() {
    alert('u won! play again');
    location.reload();
}

function render() {
    var g = svg.selectAll(".arc").data(pie(data), keyFn(data));
    
    g.enter()
        .append("g")
            .attr("class", "arc")
            .on('mouseover', function(d) {
                d3.select(this).select('path').style({'opacity': '1.0', 'cursor': 'pointer'});
                })
            .on('mouseout', function(d) {
                d3.select(this).select('path').style({'opacity': '0.6', 'cursor': 'pointer'});
                })
            .on('click', function(d){
                svg.selectAll(".arc").remove();
                newData = []
                for (i=0; i<data.length; i++) {
                    if (data[i].key == this.__data__.data.key) {
                        data[i].count++;
                    }
                    newDatum = {'key': data[i].key, 'count': data[i].count}
                    if (newDatum.count < popCount) {
                        newData.push(newDatum);
                    }
                }
                data = newData;
                if (data.length > 0) {
                    render();    
                } else {
                    win();
                }
                
            })
            .append("path")
                .attr("d", arc)
                .style({opacity:'0.6'})
                .style("fill", function(d) { return color(d.data.key); });


        g.append("text")
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", ".4em")
            .style("text-anchor", "middle")
            .on('mouseover', function(d) {
                d3.select(this).style({'cursor': 'pointer'});
            })
            .text(function(d) { return d.data.count; });
        
}

render();