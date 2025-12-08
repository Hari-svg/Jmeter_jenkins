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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 225, 0, 0.0, 108.68888888888887, 0, 217, 121.0, 158.0, 171.7, 215.0, 2.305634971871253, 3.741082876689518, 1.5644693965384733], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["02_Click_Login-5", 15, 0, 0.0, 141.40000000000003, 124, 170, 135.0, 167.0, 170.0, 170.0, 0.3620564808110065, 0.6183952977914555, 0.248913830557567], "isController": false}, {"data": ["02_Click_Login-4", 15, 0, 0.0, 103.6, 86, 136, 103.0, 130.6, 136.0, 136.0, 0.36202152821354444, 0.3121257225346334, 0.28751957178886905], "isController": false}, {"data": ["02_Click_Login-6", 15, 0, 0.0, 144.73333333333335, 127, 175, 142.0, 172.6, 175.0, 175.0, 0.3623801125794216, 0.4108626081100669, 0.24736689325489816], "isController": false}, {"data": ["07_SignOff", 15, 0, 0.0, 262.20000000000005, 222, 322, 259.0, 298.0, 322.0, 322.0, 0.21007226485911154, 0.5698757247493138, 0.2625903310738894], "isController": true}, {"data": ["01_Launch", 15, 0, 0.0, 233.93333333333334, 201, 302, 229.0, 273.8, 302.0, 302.0, 3.168567807351077, 10.657609843683987, 4.895189717997465], "isController": true}, {"data": ["05_choose_Flights-18", 15, 0, 0.0, 115.33333333333334, 97, 158, 103.0, 153.2, 158.0, 158.0, 0.4000533404453927, 1.1861998266435525, 0.37726384351246833], "isController": false}, {"data": ["07_SignOff-22", 15, 0, 0.0, 131.53333333333333, 117, 156, 131.0, 153.6, 156.0, 156.0, 0.2105676904935707, 0.3604463727960582, 0.11618236828990959], "isController": false}, {"data": ["07_SignOff-21", 15, 0, 0.0, 130.66666666666669, 105, 166, 131.0, 152.20000000000002, 166.0, 166.0, 0.21044361514071663, 0.21064912648362746, 0.1469406101812621], "isController": false}, {"data": ["03_Click_Flights-13", 15, 0, 0.0, 169.26666666666665, 126, 217, 163.0, 212.8, 217.0, 217.0, 0.36213514883754616, 1.5984871804157312, 0.255333571738973], "isController": false}, {"data": ["06_Payment", 15, 0, 0.0, 108.66666666666667, 93, 131, 108.0, 125.60000000000001, 131.0, 131.0, 0.40036299578284307, 1.1309212018897132, 0.4475672526423958], "isController": true}, {"data": ["06_Payment-19", 15, 0, 0.0, 108.66666666666667, 93, 131, 108.0, 125.60000000000001, 131.0, 131.0, 0.21047609693125852, 0.5945401623472295, 0.23529199612022397], "isController": false}, {"data": ["Debug Sampler", 15, 0, 0.0, 1.1333333333333335, 0, 11, 0.0, 5.0000000000000036, 11.0, 11.0, 0.2110921909962144, 0.18190209896001913, 0.0], "isController": false}, {"data": ["03_Click_Flights-12", 15, 0, 0.0, 143.53333333333333, 124, 180, 145.0, 168.6, 180.0, 180.0, 0.3626780144587635, 0.619456882117556, 0.255362156664813], "isController": false}, {"data": ["03_Click_Flights-11", 15, 0, 0.0, 90.80000000000003, 74, 135, 85.0, 121.80000000000001, 135.0, 135.0, 0.36309062742060416, 0.2989115223784857, 0.25458893602343147], "isController": false}, {"data": ["01_Launch-2", 15, 0, 0.0, 85.66666666666667, 75, 103, 81.0, 100.0, 103.0, 103.0, 3.430139492339355, 3.4334892379373425, 1.7653159301394923], "isController": false}, {"data": ["04_Find_Flights-17", 15, 0, 0.0, 115.73333333333332, 84, 215, 106.0, 169.40000000000003, 215.0, 215.0, 0.3922388996391402, 0.37717243148893886, 0.41090599831337277], "isController": false}, {"data": ["05_choose_Flights", 15, 0, 0.0, 115.33333333333334, 97, 158, 103.0, 153.2, 158.0, 158.0, 0.3934116659672681, 1.1665065699748216, 0.37100051963124214], "isController": true}, {"data": ["01_Launch-3", 15, 0, 0.0, 136.66666666666666, 118, 215, 131.0, 182.00000000000003, 215.0, 215.0, 3.3700292069197935, 5.776660090429117, 1.869313075713323], "isController": false}, {"data": ["02_Click_Login", 15, 0, 0.0, 389.73333333333335, 347, 449, 380.0, 445.4, 449.0, 449.0, 3.1618887015177064, 11.711545175484824, 6.843348176644183], "isController": true}, {"data": ["04_Find_Flights", 15, 0, 0.0, 115.73333333333332, 84, 215, 106.0, 169.40000000000003, 215.0, 215.0, 0.3639539962148784, 0.3499739924540205, 0.3812749839253652], "isController": true}, {"data": ["01_Launch-1", 15, 0, 0.0, 11.6, 6, 60, 7.0, 34.20000000000002, 60.0, 60.0, 3.445107946715664, 2.2339371841984383, 1.638444892627469], "isController": false}, {"data": ["03_Click_Flights", 15, 0, 0.0, 403.59999999999997, 364, 472, 397.0, 467.8, 472.0, 472.0, 0.36021324624177514, 2.5017935617885785, 0.7601765870395274], "isController": true}]}, function(index, item){
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
