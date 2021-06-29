var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var query = "https://www.illc.uva.nl/NewsandEvents/Events/Conferences/";
$.ajax({
    url: query,
    type: 'POST',
    data: {
        id: 1,
        mode: 'hoge'
    },
    dataType: 'html'
}).done(function (data, textStatus, jqXHR) {
    console.log(textStatus); //success
    var $objs = getJsonFromHTML(data, 1);
    var $htmlstr = obj2htmlstr($objs, 1);
    var $objs2 = getJsonFromHTML(data, 2);
    var $htmlstr2 = obj2htmlstr($objs2, 2);
    document.getElementById("id_conf_list").innerHTML = $htmlstr;
    document.getElementById("id_conf_list2").innerHTML = $htmlstr2; //writeHtml(HTML_TABLE)
    // console.log(data)
    // console.log(textStatus)
    // console.log(jqXHR)
}).fail(function (jqXHR, textStatus, errorThrown) {
    console.log(textStatus); //fail
}).always(function (jqXHR, textStatus) {
    console.log(textStatus); //always
});
function obj2htmlstr(xobjs, $deadOrComing) {
    var $html_table = "";
    for (var i = 0; i < xobjs.length; i++) {
        var _detail_url = query + xobjs[i].detail_url;
        var _conf_date = xobjs[i].conf_date;
        var _conf_name = xobjs[i].conf_name;
        var _conf_place = xobjs[i].conf_place;
        var _deadline = function () {
            var hoge = xobjs[i].deadline;
            if (hoge === undefined) {
                return "-";
            }
            else {
                return hoge;
            }
        };
        $html_table += "<tr>";
        $html_table += "<td>" + _deadline() + "</td>";
        $html_table += "<td style=\"width:120px\">" + _conf_date + "</td>";
        $html_table += "<td>" + _conf_name + "</td>";
        $html_table += "<td>" + _conf_place + "</td>";
        $html_table += "<td><a href=\"" + _detail_url + "\"  target=\"_blank\">detail</a></td>";
        $html_table += "</tr>";
    }
    function deadORcom(x) {
        if (x === 1) {
            return "Deadline";
        }
        else if (x === 2) {
            return "";
        }
        else {
            return "Error";
        }
    }
    var _html = "            <table id=\"id_sorttable\" class=\"tablesorter \">\n                <thead>\n                    <tr>\n                        <th>" + deadORcom($deadOrComing) + "</th>\n                        <th>Date<br></th>\n                        <th>Conference name</th>\n                        <th>Place<br></th>\n                        <th>Link<br></th>\n                    </tr>\n                </thead>" +
        $html_table +
        "</table>";
    return _html;
}
function getJsonFromHTML($html, $deadOrComing) {
    // console.log($deadOrComing)
    var _object_list = [];
    var $html2 = $html.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    var _topic_cfp_conf = $($html2).find(".linklist");
    var _cfp = _topic_cfp_conf[$deadOrComing];
    var _list_cfp = $(_cfp).find("li a");
    var _loop_1 = function () {
        var _detail_url = $(_list_cfp[i]).attr('href');
        var _common = _list_cfp[i].innerText.split("(deadline:");
        var _deadline = _common[1]; // 締切
        var _date_name_place = _common[0].split(",");
        // console.log(_date_name_place)
        var _conf_name_place = function () {
            if (_date_name_place.length === 1) {
                return {
                    date: "",
                    name: _date_name_place[0],
                    place: ""
                };
            }
            else if (_date_name_place.length === 2) {
                return {
                    date: _date_name_place[0],
                    name: _date_name_place[1],
                    place: ""
                };
            }
            else if (_date_name_place.length === 3) {
                return {
                    date: _date_name_place[0],
                    name: _date_name_place[1],
                    place: _date_name_place[2]
                };
            }
            else {
                var last1 = _date_name_place.length;
                var last2 = _date_name_place.length - 1;
                var last3 = _date_name_place.length - 2;
                var dnp1 = _date_name_place.slice(1, last2);
                var dnp2 = _date_name_place.slice(1, last3);
                // console.log("dnp1",dnp1)
                // console.log("dnp2",dnp2)
                if (dnp2.join(",").slice(-1) === ")") {
                    return {
                        date: _date_name_place[0],
                        name: dnp2.join(","),
                        place: _date_name_place.slice(last3, last1).join(",")
                    };
                }
                else {
                    return {
                        date: _date_name_place[0],
                        name: dnp1.join(","),
                        place: _date_name_place.slice(last2)
                    };
                }
            }
        };
        // console.log(_conf_name_place().date)
        _object_list[i] = {
            detail_url: _detail_url,
            conf_date: formatDate2(_conf_name_place().date),
            conf_name: _conf_name_place().name,
            conf_place: _conf_name_place().place,
            deadline: formatDate2(_deadline)
        };
    };
    for (var i = _list_cfp.length - 1; i >= 0; i--) {
        _loop_1();
    }
    return _object_list;
}
function head($x) {
    return $x[0];
}
function formatDate2($date) {
    if ($date !== undefined && $date !== "") {
        var aaa_1 = $date
            .replace("Monday", "")
            .replace("Tuesday", "")
            .replace("Wednesday", "")
            .replace("Thursday", "")
            .replace("Friday", "")
            .replace("Saturday", "")
            .replace("Sunday", "")
            .split(" ")
            .filter(function (x) { return x !== ""; })
            .filter(function (x) { return x !== "\n"; })
            .filter(function (x) { return x !== ")\n"; });
        var _year = aaa_1[aaa_1.length - 1]
            .replace(")", "")
            .replace("20", "'");
        var bbb_1 = (aaa_1
            .slice(0, aaa_1.length - 1)
            .join(" ")
            .split(")")
            .slice(-1))[0]
            .split("-")
            .map(function (x) { return x
            .split(" ")
            .filter(function (x) { return x !== ""; }); }); // [xx[20,undefined],yy[1,June]]
        var fff = function () {
            var xx = bbb_1[0];
            var yy = bbb_1[1];
            if (bbb_1.length === 1) {
                return replaceMonth2num(xx[1]) + "/" + xx[0];
            }
            else if (bbb_1.length === 2) {
                if (xx.length === 1) {
                    return replaceMonth2num(yy[1]) + "/" + xx[0] + " - " + yy[0];
                }
                else if (xx.length == 2) {
                    return replaceMonth2num(xx[1]) + "/" + xx[0] + " - " + replaceMonth2num(yy[1]) + "/" + yy[0];
                }
            }
        };
        console.log("fff", fff());
        // console.log(eee.length)
        var _info = function () {
            aaa_1.pop();
            aaa_1.pop();
            var bbb = aaa_1.join("").split(")");
            if (bbb.length === 1) {
                return "";
            }
            else {
                return "<br><span style=\"color:red;\">" + bbb[0] + ")</span>";
            }
        };
        // return `${_year}/${_month}/${_info()}`
        return "" + fff() + _info();
        // return `${fff()}`
    }
    else {
        return "";
    }
}
function replaceMonth2num($num) {
    if ($num === undefined) {
        return "error";
    }
    else {
        return $num
            .replace("January", "01")
            .replace("February", "02")
            .replace("March", "03")
            .replace("April", "04")
            .replace("May", "05")
            .replace("June", "06")
            .replace("July", "07")
            .replace("August", "08")
            .replace("September", "09")
            .replace("October", "10")
            .replace("November", "11")
            .replace("December", "12");
    }
}
function replaceArrayElements(array, targetId, sourceId) {
    return array.reduce(function (resultArray, element, id, originalArray) { return __spreadArray(__spreadArray([], resultArray), [
        id === targetId ? originalArray[sourceId] :
            id === sourceId ? originalArray[targetId] :
                element
    ]); }, []);
}
function formatDate($date) {
    if ($date !== undefined && $date !== "") {
        var aaa_2 = $date
            .replace("Monday", "")
            .replace("Tuesday", "")
            .replace("Wednesday", "")
            .replace("Thursday", "")
            .replace("Friday", "")
            .replace("Saturday", "")
            .replace("Sunday", "")
            .split(" ")
            .filter(function (x) { return x !== ""; })
            .filter(function (x) { return x !== "\n"; })
            .filter(function (x) { return x !== ")\n"; });
        var _year = aaa_2[aaa_2.length - 1]
            .replace(")", "")
            .replace("20", "'");
        var _month = aaa_2[aaa_2.length - 2]
            .replace("January", "01")
            .replace("February", "02")
            .replace("March", "03")
            .replace("April", "04")
            .replace("May", "05")
            .replace("June", "06")
            .replace("July", "07")
            .replace("August", "08")
            .replace("September", "09")
            .replace("October", "10")
            .replace("November", "11")
            .replace("December", "12");
        var _day = function () {
            aaa_2.pop();
            aaa_2.pop();
            var bbb = aaa_2.join("").split(")");
            if (bbb.length === 1) {
                return bbb[0];
            }
            else {
                return bbb[1] + "<br><span style=\"color:red;\">" + bbb[0] + ")</span>";
            }
        };
        return _year + "/" + _month + "/" + _day();
    }
    else {
        return "";
    }
}
