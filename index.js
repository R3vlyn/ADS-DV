var playstoreapps;
var selectedgenre;
var selectedgenrebuttonid;
var includedattributes = [];
var currentstep = 1;
var completes = document.querySelectorAll(".complete");
var route = "";
var maxinstalls = 1000000;
var mininstalls = 0
var maxinstallsvalue =

    $(document).ready(function() {
        $('.carousel').carousel('pause');

    });

function SelectNewApp() {
    this.route = "newapp";
    showClassElements("newappitem");
    hideClassElements("changeappitem");

    nextStep();
}

function SelectChangeApp() {
    this.route = "changeapp";
    showClassElements("changeappitem");
    hideClassElements("newappitem");
    nextStep();
}

function showClassElements(classname) {
    $(`.${classname}`).show();
}

function hideClassElements(classname) {
    $(`.${classname}`).hide();
}


function toggleComplete() {
    var lastComplete = completes[completes.length - 1];
    lastComplete.classList.toggle('complete');
}

function nextStep() {
    $('.carousel').carousel('next')
    currentstep = currentstep + 1;
    $(`#step${currentstep}`).addClass('complete');
}

function previousStep() {
    $('.carousel').carousel('prev')
    $(`#step${currentstep}`).removeClass('complete');
    currentstep = currentstep - 1;
    $(`#step${currentstep}`).addClass('complete');
}

function restart() {
    $(".complete").removeClass('complete');
    currentstep = 1;
    $(`#step${currentstep}`).addClass('complete');
}


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
    setInstallsValues(data);

    makeChart(myData);
    makeChartJS(myData);
});


function setInstallsValues(data) {
    this.maxinstalls = getMax(data, "installs_new");
    this.mininstalls = getMin(data, "installs_new");
    alert(mininstalls + "-" + maxinstalls);
    $(document).ready(function() {
        $('#maxinstallsrange').attr({
            "max": this.maxinstalls,
            "min": this.mininstalls,
            "step": (this.maxinstalls - this.mininstalls) / 20
        });
        $('#mininstallsrange').attr({
            "max": this.maxinstalls,
            "min": this.mininstalls,
            "step": (this.maxinstalls - this.mininstalls) / 20
        });
        $('#maxinstallsrange').change(function() {
            var myVar = $(this).val();
            $('#maxinstallslabel').text(myVar);
        });
        $('#mininstallsrange').change(function() {
            var myVar = $(this).val();
            $('#mininstallslabel').text(myVar);
        });
    });

}


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

function swap(json) {
    var ret = {};
    for (var key in json) {
        console.log(json[key].value);
        ret[json[key].value] = json[key].key;
    }
    return ret;
}

function makeChartJS(data) {


    var categoriesAvgRating = d3.nest()
        .key(function(d) { return d.Category; })
        .rollup(function(v) { return d3.mean(v, function(d) { return d.Rating; }); })
        .entries(data);

    console.log(categoriesAvgRating);

    var swapped = swap(categoriesAvgRating);
    console.log(swapped);

    const ordered = {};
    Object.keys(swapped).sort(function(a, b) { return b - a; }).forEach(function(key) {
        ordered[key] = swapped[key];
    });
    console.log(ordered);

    values = Array.from(Object.keys(ordered));
    labels = Array.from(Object.values(ordered));

    new Chart(document.getElementById("bar-chart"), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: "Average rating",
                backgroundColor: "#3e95cd",
                data: values
            }]
        },
        options: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Average rating per category'
            }
        }
    });
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

    result.sort()
    result.forEach(element => {
        addGenreButton(element);
    })

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


function selectGenre(genre, buttonid) {
    console.log(`selection = ${genre} with buttonid ${buttonid}`);
    $(selectedgenrebuttonid).removeClass('greenbackground');
    $(buttonid).addClass('greenbackground');
    selectedgenre = genre;
    selectedgenrebuttonid = buttonid;
}

function addGenreButton(genre, rownum = 1, colnum = 1) {
    if (colnum > 3) {
        rownum++;
        colnum = 1;
    }
    if ($(`#row-${rownum}`).length == 0) {
        $("#genres").append(`<div class='row' id='row-${rownum}'></div>`)
        addGenreButton(genre, rownum, colnum)
    } else if ($(`#row-${rownum}-col-${colnum}`).length == 0) {
        $(`#row-${rownum}`).append(`<button id="row-${rownum}-col-${colnum}" type="button" class="btn btn-primary col-sm-4" onclick="selectGenre(\'${genre}\', '#row-${rownum}-col-${colnum}')">${genre}</button>`)
    } else {
        addGenreButton(genre, rownum, colnum + 1);
    }
}

function getMin(data, attr) {
    return d3.min(data, function(d) { return d[attr]; });
}

function getMax(data, attr) {
    return d3.max(data, function(d) { return d[attr]; });
}

function getExtent(data, attr) {
    return d3.extent(data, function(d) { return d[attr]; });
}

function getMean(data, attr) {
    return d3.mean(data, function(d) { return d[attr]; });
}

function getMedian(data, attr) {
    return d3.median(data, function(d) { return d[attr]; });
}

function getDeviation(data, attr) {
    return d3.deviation(data, function(d) { return d[attr]; });
}

d3.select('h1').style('color', 'grey');
d3.selectAll();