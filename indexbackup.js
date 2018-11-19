var playstoreapps;

var includedattributes = [];

var svg = d3.select("svg"),
    margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var q = d3.queue();

var myData = null;

d3.csv("playstoredata.csv", function(d) {
    return d;
}).then(function(data) {
    myData = data;
    console.log(myData);
    makeChart(myData);
});

onclick = "myFunction()"

function includeAttr(attr) {
    console.log("including attribute: " + attr);
    if (!includedattributes.includes(attr)) {
        this.includedattributes.concat(attr)
    }
    $('#' + attr + "box").addClass('greenborder').removeClass('redborder');
}

function excludeAttr(attr) {
    console.log("excluding attribute: " + attr);
    if (includedattributes.includes(attr)) {
        var index = array.indexOf(attr);
        if (index > -1) {
            array.splice(index, 1);
        }
    }
    $('#' + attr + "box").addClass('redborder').removeClass('greenborder');
}

function makeChart(data) {
    console.log("Chart creation initiated");
    var lookup = {};
    var result = [];

    data.forEach(element => {
        var name = element.Category;
        if (!(name in lookup)) {
            lookup[name] = 1;
            result.push(name);
        }
    });

    var unique = data.filter((v, i, a) => a.indexOf(v) === i);
    console.log(result);
    var categoriesAvgRating = d3.nest()
        .key(function(d) { return d.Category; })
        .rollup(function(v) { return d3.mean(v, function(d) { return d.Rating; }); })
        .entries(data);

    console.log(categoriesAvgRating);

    x.domain(categoriesAvgRating.map(function(d) {
        return d.key;
    }));
    y.domain([0, d3.max(categoriesAvgRating, function(d) {
        return Number(d.value);
    })]);

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))

    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Rating");

    g.selectAll(".bar")
        .data(categoriesAvgRating)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
            return x(d.key);
        })
        .attr("y", function(d) {
            return y(Number(d.value));
        })
        .attr("width", x.bandwidth())
        .attr("height", function(d) {
            return height - y(Number(d.value));
        });
}

function getMin(data, attr) {
    return d3.min(data, function(d) { return d[attr]; });

}

function getMax(data, attr) {
    return d3.min(data, function(d) { return d[attr]; });
}

function getExtent(data, attr) {
    return d3.extent(data, function(d) { return d[attr]; });
}


function getMean(data, attr) {
    return d3.extent(data, function(d) { return d[attr]; });
}

function getMedian(data, attr) {
    return d3.extent(data, function(d) { return d[attr]; });
}

function getDeviation(data, attr) {
    return d3.extent(data, function(d) { return d[attr]; });
}

d3.select('h1').style('color', 'grey');
d3.selectAll();