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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "02_Click_Login-5"], "isController": false}, {"data": [1.0, 500, 1500, "02_Click_Login-4"], "isController": false}, {"data": [1.0, 500, 1500, "02_Click_Login-6"], "isController": false}, {"data": [1.0, 500, 1500, "07_SignOff"], "isController": true}, {"data": [1.0, 500, 1500, "01_Launch"], "isController": true}, {"data": [1.0, 500, 1500, "05_choose_Flights-18"], "isController": false}, {"data": [1.0, 500, 1500, "07_SignOff-22"], "isController": false}, {"data": [1.0, 500, 1500, "07_SignOff-21"], "isController": false}, {"data": [1.0, 500, 1500, "03_Click_Flights-13"], "isController": false}, {"data": [1.0, 500, 1500, "06_Payment"], "isController": true}, {"data": [1.0, 500, 1500, "06_Payment-19"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "03_Click_Flights-12"], "isController": false}, {"data": [1.0, 500, 1500, "03_Click_Flights-11"], "isController": false}, {"data": [1.0, 500, 1500, "01_Launch-2"], "isController": false}, {"data": [1.0, 500, 1500, "04_Find_Flights-17"], "isController": false}, {"data": [1.0, 500, 1500, "05_choose_Flights"], "isController": true}, {"data": [1.0, 500, 1500, "01_Launch-3"], "isController": false}, {"data": [1.0, 500, 1500, "02_Click_Login"], "isController": true}, {"data": [1.0, 500, 1500, "04_Find_Flights"], "isController": true}, {"data": [1.0, 500, 1500, "01_Launch-1"], "isController": false}, {"data": [1.0, 500, 1500, "03_Click_Flights"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 225, 0, 0.0, 108.31111111111115, 0, 199, 120.0, 151.4, 163.39999999999998, 187.70000000000005, 3.0031633320430853, 4.873362441772, 2.0384362153134634], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["02_Click_Login-5", 15, 0, 0.0, 134.53333333333336, 113, 160, 133.0, 152.8, 160.0, 160.0, 0.33049839157449434, 0.5644938348279205, 0.22721764420746485], "isController": false}, {"data": ["02_Click_Login-4", 15, 0, 0.0, 107.46666666666667, 86, 184, 105.0, 149.20000000000002, 184.0, 184.0, 0.3301128986113251, 0.2845719329760778, 0.26217755534892934], "isController": false}, {"data": ["02_Click_Login-6", 15, 0, 0.0, 135.20000000000002, 119, 164, 135.0, 153.8, 164.0, 164.0, 0.3306076568733332, 0.3748393453417381, 0.22567846890083973], "isController": false}, {"data": ["07_SignOff", 15, 0, 0.0, 278.66666666666663, 259, 341, 276.0, 312.8, 341.0, 341.0, 0.35160919809662217, 0.9544037953282858, 0.43951149762077774], "isController": true}, {"data": ["01_Launch", 15, 0, 0.0, 240.66666666666666, 208, 327, 228.0, 325.2, 327.0, 327.0, 3.178639542275906, 10.69148654375927, 4.910749761602034], "isController": true}, {"data": ["05_choose_Flights-18", 15, 0, 0.0, 113.26666666666667, 100, 151, 106.0, 151.0, 151.0, 151.0, 0.29708853238265004, 0.8813046209645474, 0.28053203604674193], "isController": false}, {"data": ["07_SignOff-22", 15, 0, 0.0, 139.8, 119, 189, 137.0, 163.8, 189.0, 189.0, 0.3527668681357447, 0.604434793984149, 0.19464187548505443], "isController": false}, {"data": ["07_SignOff-21", 15, 0, 0.0, 138.86666666666665, 126, 156, 140.0, 153.6, 156.0, 156.0, 0.35274198099896525, 0.3530864555897846, 0.24629933243580096], "isController": false}, {"data": ["03_Click_Flights-13", 15, 0, 0.0, 160.93333333333334, 142, 199, 155.0, 188.8, 199.0, 199.0, 0.3302291790502609, 1.457652235651542, 0.2328373703850472], "isController": false}, {"data": ["06_Payment", 15, 0, 0.0, 114.39999999999999, 88, 180, 105.0, 159.0, 180.0, 180.0, 0.29663028001898434, 0.8380577885223858, 0.3318744376384275], "isController": true}, {"data": ["06_Payment-19", 15, 0, 0.0, 114.39999999999999, 88, 180, 105.0, 159.0, 180.0, 180.0, 0.3528830545557203, 0.9969865257487003, 0.3948108914414097], "isController": false}, {"data": ["Debug Sampler", 15, 0, 0.0, 1.0666666666666669, 0, 7, 1.0, 4.000000000000002, 7.0, 7.0, 0.35403242937053037, 0.3046615007434681, 0.0], "isController": false}, {"data": ["03_Click_Flights-12", 15, 0, 0.0, 136.26666666666668, 117, 162, 135.0, 160.2, 162.0, 162.0, 0.33040375338663847, 0.5643321920637019, 0.2326377990153968], "isController": false}, {"data": ["03_Click_Flights-11", 15, 0, 0.0, 89.13333333333333, 73, 143, 78.0, 140.0, 143.0, 143.0, 0.3310454415042705, 0.27253057342587894, 0.23211975292975215], "isController": false}, {"data": ["01_Launch-2", 15, 0, 0.0, 87.86666666666667, 73, 119, 82.0, 114.2, 119.0, 119.0, 3.4891835310537336, 3.4925909368457777, 1.7957028524075365], "isController": false}, {"data": ["04_Find_Flights-17", 15, 0, 0.0, 113.06666666666666, 99, 138, 104.0, 136.8, 138.0, 138.0, 0.30549275982159224, 0.2938180039612228, 0.320389509633205], "isController": false}, {"data": ["05_choose_Flights", 15, 0, 0.0, 113.26666666666667, 100, 151, 106.0, 151.0, 151.0, 151.0, 0.30569821472242603, 0.9068449969939676, 0.2886619079644575], "isController": true}, {"data": ["01_Launch-3", 15, 0, 0.0, 135.66666666666666, 119, 169, 133.0, 160.6, 169.0, 169.0, 3.4698126301179735, 5.947701610571362, 1.9246616932685634], "isController": false}, {"data": ["02_Click_Login", 15, 0, 0.0, 377.20000000000005, 322, 464, 373.0, 441.8, 464.0, 464.0, 3.2967032967032965, 12.210465315934066, 7.1351304945054945], "isController": true}, {"data": ["04_Find_Flights", 15, 0, 0.0, 113.06666666666666, 99, 138, 104.0, 136.8, 138.0, 138.0, 0.33178500331785005, 0.3191054592457421, 0.3479638423468259], "isController": true}, {"data": ["01_Launch-1", 15, 0, 0.0, 17.133333333333333, 7, 73, 10.0, 61.00000000000001, 73.0, 73.0, 3.4899953466728713, 2.26304385760819, 1.6597927088180549], "isController": false}, {"data": ["03_Click_Flights", 15, 0, 0.0, 386.3333333333333, 353, 463, 377.0, 449.8, 463.0, 463.0, 0.3287671232876712, 2.283390410958904, 0.6938142123287672], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 225, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
