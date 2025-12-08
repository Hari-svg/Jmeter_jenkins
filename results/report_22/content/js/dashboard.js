/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 6.666666666666667, "KoPercent": 93.33333333333333};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.045454545454545456, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "02_Click_Login-5"], "isController": false}, {"data": [0.0, 500, 1500, "02_Click_Login-4"], "isController": false}, {"data": [0.0, 500, 1500, "02_Click_Login-6"], "isController": false}, {"data": [0.0, 500, 1500, "07_SignOff"], "isController": true}, {"data": [0.0, 500, 1500, "01_Launch"], "isController": true}, {"data": [0.0, 500, 1500, "05_choose_Flights-18"], "isController": false}, {"data": [0.0, 500, 1500, "07_SignOff-22"], "isController": false}, {"data": [0.0, 500, 1500, "07_SignOff-21"], "isController": false}, {"data": [0.0, 500, 1500, "03_Click_Flights-13"], "isController": false}, {"data": [0.0, 500, 1500, "06_Payment"], "isController": true}, {"data": [0.0, 500, 1500, "06_Payment-19"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.0, 500, 1500, "03_Click_Flights-12"], "isController": false}, {"data": [0.0, 500, 1500, "03_Click_Flights-11"], "isController": false}, {"data": [0.0, 500, 1500, "01_Launch-2"], "isController": false}, {"data": [0.0, 500, 1500, "04_Find_Flights-17"], "isController": false}, {"data": [0.0, 500, 1500, "05_choose_Flights"], "isController": true}, {"data": [0.0, 500, 1500, "01_Launch-3"], "isController": false}, {"data": [0.0, 500, 1500, "02_Click_Login"], "isController": true}, {"data": [0.0, 500, 1500, "04_Find_Flights"], "isController": true}, {"data": [0.0, 500, 1500, "01_Launch-1"], "isController": false}, {"data": [0.0, 500, 1500, "03_Click_Flights"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 225, 210, 93.33333333333333, 2036.1822222222224, 0, 2732, 2139.0, 2357.8, 2464.8999999999996, 2684.220000000001, 2.0566351620628507, 5.027223279738944, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["02_Click_Login-5", 15, 15, 100.0, 2116.8, 1972, 2162, 2127.0, 2159.6, 2162.0, 2162.0, 0.6561966840194234, 1.6949611613587645, 0.0], "isController": false}, {"data": ["02_Click_Login-4", 15, 15, 100.0, 2211.6666666666665, 2048, 2503, 2170.0, 2484.4, 2503.0, 2503.0, 0.6439426461749808, 1.6633088858718983, 0.0], "isController": false}, {"data": ["02_Click_Login-6", 15, 15, 100.0, 2133.6, 1942, 2337, 2141.0, 2311.2, 2337.0, 2337.0, 0.6503360069369175, 1.6798229866681118, 0.0], "isController": false}, {"data": ["07_SignOff", 15, 15, 100.0, 4325.533333333333, 4136, 4724, 4290.0, 4592.6, 4724.0, 4724.0, 0.23970851444643315, 1.2383379310758118, 0.0], "isController": true}, {"data": ["01_Launch", 15, 15, 100.0, 6579.400000000001, 6378, 6968, 6497.0, 6956.0, 6968.0, 6968.0, 1.3706140350877192, 10.620920281661183, 0.0], "isController": true}, {"data": ["05_choose_Flights-18", 15, 15, 100.0, 2216.2000000000003, 1993, 2608, 2188.0, 2558.8, 2608.0, 2608.0, 0.3204511952829584, 0.8277279409408448, 0.0], "isController": false}, {"data": ["07_SignOff-22", 15, 15, 100.0, 2138.7999999999997, 1973, 2254, 2142.0, 2245.0, 2254.0, 2254.0, 0.2537212449255751, 0.6553639578399865, 0.0], "isController": false}, {"data": ["07_SignOff-21", 15, 15, 100.0, 2186.7333333333336, 2040, 2485, 2157.0, 2344.6, 2485.0, 2485.0, 0.24795847522068307, 0.6404786786706119, 0.0], "isController": false}, {"data": ["03_Click_Flights-13", 15, 15, 100.0, 2178.933333333333, 1997, 2487, 2139.0, 2410.8, 2487.0, 2487.0, 0.6185056902523502, 1.597605029997526, 0.0], "isController": false}, {"data": ["06_Payment", 15, 15, 100.0, 2172.5999999999995, 2036, 2453, 2125.0, 2401.4, 2453.0, 2453.0, 0.3198839887400836, 0.8262628420092979, 0.0], "isController": true}, {"data": ["06_Payment-19", 15, 15, 100.0, 2172.5999999999995, 2036, 2453, 2125.0, 2401.4, 2453.0, 2453.0, 0.24732069249793903, 0.6388312809150866, 0.0], "isController": false}, {"data": ["Debug Sampler", 15, 0, 0.0, 1.0666666666666667, 0, 8, 0.0, 4.400000000000002, 8.0, 8.0, 0.2637409009389176, 0.13286634710060835, 0.0], "isController": false}, {"data": ["03_Click_Flights-12", 15, 15, 100.0, 2168.2000000000007, 1982, 2352, 2160.0, 2302.8, 2352.0, 2352.0, 0.6197578812543899, 1.6008394491385365, 0.0], "isController": false}, {"data": ["03_Click_Flights-11", 15, 15, 100.0, 2229.4666666666662, 1930, 2359, 2253.0, 2359.0, 2359.0, 2359.0, 0.6286408784208541, 1.6237843002179289, 0.0], "isController": false}, {"data": ["01_Launch-2", 15, 15, 100.0, 2126.2666666666664, 2108, 2151, 2126.0, 2148.0, 2151.0, 2151.0, 2.6232948583420774, 6.775991113588668, 0.0], "isController": false}, {"data": ["04_Find_Flights-17", 15, 15, 100.0, 2209.266666666667, 1912, 2470, 2172.0, 2441.8, 2470.0, 2470.0, 0.33033099165363694, 0.8532475321522165, 0.0], "isController": false}, {"data": ["05_choose_Flights", 15, 15, 100.0, 2216.2000000000003, 1993, 2608, 2188.0, 2558.8, 2608.0, 2608.0, 0.3276897870016384, 0.8464252799016931, 0.0], "isController": true}, {"data": ["01_Launch-3", 15, 15, 100.0, 2128.9333333333334, 2113, 2189, 2128.0, 2159.0, 2189.0, 2189.0, 2.5870989996550535, 6.682496927819938, 0.0], "isController": false}, {"data": ["02_Click_Login", 15, 15, 100.0, 6462.0666666666675, 6120, 6777, 6456.0, 6774.0, 6777.0, 6777.0, 1.484266772214526, 11.501618005392837, 0.0], "isController": true}, {"data": ["04_Find_Flights", 15, 15, 100.0, 2209.266666666667, 1912, 2470, 2172.0, 2441.8, 2470.0, 2470.0, 0.5919962112242482, 1.5291308385626332, 0.0], "isController": true}, {"data": ["01_Launch-1", 15, 15, 100.0, 2324.2000000000003, 2112, 2732, 2235.0, 2719.4, 2732.0, 2732.0, 2.3783098144918347, 6.143192831377834, 0.0], "isController": false}, {"data": ["03_Click_Flights", 15, 15, 100.0, 6576.599999999999, 6341, 7071, 6483.0, 6985.8, 7071.0, 7071.0, 0.5273334505185445, 4.0863192674459485, 0.0], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 210, 100.0, 93.33333333333333], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 225, 210, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 210, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["02_Click_Login-5", 15, 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["02_Click_Login-4", 15, 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["02_Click_Login-6", 15, 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["05_choose_Flights-18", 15, 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["07_SignOff-22", 15, 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["07_SignOff-21", 15, 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["03_Click_Flights-13", 15, 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["06_Payment-19", 15, 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["03_Click_Flights-12", 15, 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["03_Click_Flights-11", 15, 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["01_Launch-2", 15, 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["04_Find_Flights-17", 15, 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["01_Launch-3", 15, 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["01_Launch-1", 15, 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
