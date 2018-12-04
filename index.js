var playstoreapps;
var selectedgenre = '';
var selectedgenrebuttonid;
var includedattributes = [];
var currentstep = 1;
var completes = document.querySelectorAll(".complete");
var route = "";
var selectedcontentrating = '';
var cost = '';
var maxinstalls = 1000000;
var mininstalls = 0;
var contentratings = ['Everyone', 'Teen', 'Everyone 10+', 'Mature 17+',
    'Adults only 18+', 'Unrated'
];

var android_versions = ['4.0.3', '4.2', '4.4', '2.3', '3.0', '4.1', '4.0', '2.3.3', '2.2',
    '5.0', '6.0', '1.6', '1.5', '2.1', '7.0', '5.1', '4.3', '2.0',
    '3.2', '7.1', '8.0', '3.1', '2.0.1', '1.0', 'none'
]

var select = document.getElementById("selectAndroidVersion");
this.android_versions = this.android_versions.sort();
for (var i = 0; i < android_versions.length; i++) {
    var opt = android_versions[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el);
}
var installationsteps = {
    1: 5,
    2: 50,
    3: 500,
    4: 5000,
    5: 50000,
    6: 500000,
    7: 5000000,
    8: 50000000,
    9: 500000000
};

class Goals {
    constructor(maxinstalls, mininstalls, minrating, minreviews) {
        this.maxinstalls = maxinstalls;
        this.mininstalls = mininstalls;
        this.minrating = minrating;
        this.minreviews = minreviews;
    }

    validateGoals() {
        alert(this.maxinstalls + "-" + this.mininstalls + "-" + this.minrating + "-" + this.minreviews)
        if (this.mininstalls != "-" && this.maxinstalls != "-" && this.minrating != "-" && this.minreviews != "-") {
            if (this.mininstalls > 500000000) {
                return "installations can not be above 500000000";
            }
            if (this.maxinstalls > 500000000) {
                return "installations can not be above 500000000";
            }
            if (this.minreviews > 500000000) {
                return "reviews can not be above 500000000";
            }
            if (this.mininstalls < 0) {
                return "installations can not be below 0";
            }
            if (this.maxinstalls < 0) {
                return "installations can not be below 0";
            }
            if (this.minreviews < 0) {
                return "reviews can not be below 0";
            }
            if (this.minrating > 5) {
                return "rating can not be above 5";
            }
            if (this.minrating < 0) {
                return "rating can not be below 0";
            }
            return "ok";
        } else {
            return "Not all goals are defined"
        }
    }
}
class Knowns {
    constructor(genre, version, cost, contentrating) {
        this.wannaknow = [];
        this.known = [];
        if (genre === '') {
            this.wannaknow.push("genre");
        } else {
            this.genre = genre;
            this.known.push("genre");
        }
        if (version === 'none') {
            this.wannaknow.push("version");
        } else {
            this.version = version;
            this.known.push("version");
        }
        if (cost === '') {
            this.wannaknow.push("cost");
        } else {
            this.cost = cost;
            this.known.push("cost");
        }
        if (contentrating === '') {
            this.wannaknow.push("contentrating");
        } else {
            this.contentrating = contentrating;
            this.known.push("contentrating");
        }
    }


}


var goals;
var knowns;

$(document).ready(function() {
    $('.carousel').carousel('pause');

});

function submitKnowns() {
    var selectedversion = $("#selectAndroidVersion option:selected").text();
    this.knowns = new Knowns(this.selectedgenre, selectedversion, this.cost, this.selectedcontentrating)
    nextStep();
    calculateCharts(this.knowns);
}

function calculateCharts(knowns, goals); {

}

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
    $(`#step${currentstep}text`).text('Done!');
    currentstep = currentstep + 1;
    $(`#step${currentstep}`).addClass('complete');

}

function previousStep() {
    $('.carousel').carousel('prev')
    $(`#step${currentstep}`).removeClass('complete');
    currentstep = currentstep - 1;
    $(`#step${currentstep}`).addClass('complete');
    $(`#step${currentstep}text`).text('To-Do');
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

function submitGoals() {
    var rating = $('#minratinglabel').text();
    var maxinstalls = $('#maxinstallslabel').text();
    var minreviews = $('#minreviewslabel').text();
    var mininstalls = $('#mininstallslabel').text();
    this.goals = new Goals(maxinstalls, mininstalls, rating, minreviews);
    var validationresult = this.goals.validateGoals()
    if (validationresult == "ok") {
        nextStep();
    } else {
        alert(validationresult);
    }

}

function setInstallsValues(data) {
    this.maxinstalls = getMax(data, "installs_new");
    this.mininstalls = getMin(data, "installs_new");;
    document.getElementById("maxinstallsrange").max = 9;
    document.getElementById("maxinstallsrange").min = 1;
    document.getElementById("maxinstallsrange").step = 1;
    document.getElementById("mininstallsrange").max = 9;
    document.getElementById("mininstallsrange").min = 1;
    document.getElementById("mininstallsrange").step = 1;
    document.getElementById("mininstallsrange").max = 9;
    document.getElementById("mininstallsrange").min = 1;
    document.getElementById("mininstallsrange").step = 1;

    $(document).ready(function() {
        $('#ratingrange').change(function() {
            var myVar = $(this).val();
            $('#minratinglabel').text(myVar);
        });
        $('#maxinstallsrange').change(function() {
            var myVar = $(this).val();
            $('#maxinstallslabel').text(installationsteps[myVar]);
        });
        $('#reviewrange').change(function() {
            var myVar = $(this).val();
            $('#minreviewslabel').text(installationsteps[myVar]);
        });
        $('#mininstallsrange').change(function() {
            var myVar = $(this).val();
            $('#mininstallslabel').text(installationsteps[myVar]);
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

    var swapped = swap(categoriesAvgRating);

    const ordered = {};

    Object.keys(swapped).sort(function(a, b) { return b - a; }).forEach(function(key) {
        ordered[key] = swapped[key];
    });

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

function selectContentRating(index) {
    if (contentratings[index] === this.selectedcontentrating) {
        this.selectedcontentrating = '';
        $(`#crb_${index}`).removeClass('greenbackground');
    } else {
        $(`#crb_${index}`).addClass('greenbackground');
        x = contentratings.indexOf(this.selectedcontentrating);
        $(`#crb_${x}`).removeClass('greenbackground');
        // var numberarray = [0, 1, 2, 3, 4, 5]
        this.selectedcontentrating = contentratings[index];
        // numberarray.forEach(function(element) {
        //     if (element !== index) {
        //         console.log(element + "-" + index);
        //         $(`#crb_${index}`).removeClass('greenbackground');
        //     }
        // });
    }

}

function selectFreeApp() {
    if (this.selectedcost === 'free') {
        $('#freeappbutton').removeClass('greenbackground');
        this.selectedcost = '';
    } else {
        $('#paidappbutton').removeClass('greenbackground');
        $('#freeappbutton').addClass('greenbackground');
        this.selectedcost = 'free';
    }
}

function selectPaidApp() {
    if (this.selectedcost === 'paid') {
        $('#paidappbutton').removeClass('greenbackground');
        this.selectedcost = '';
    } else {
        $('#paidappbutton').addClass('greenbackground');
        $('#freeappbutton').removeClass('greenbackground');
        this.selectedcost = 'paid';
    }
}

function selectGenre(genre, buttonid) {
    if (this.selectedgenre === genre) {
        $(buttonid).removeClass('greenbackground');
        selectedgenre = '';
    } else {
        console.log(`selection = ${genre} with buttonid ${buttonid}`);
        $(selectedgenrebuttonid).removeClass('greenbackground');
        $(buttonid).addClass('greenbackground');
        selectedgenre = genre;
        selectedgenrebuttonid = buttonid;
    }
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