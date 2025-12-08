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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9984848484848485, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "02_Click_Login-5"], "isController": false}, {"data": [1.0, 500, 1500, "02_Click_Login-4"], "isController": false}, {"data": [1.0, 500, 1500, "02_Click_Login-6"], "isController": false}, {"data": [1.0, 500, 1500, "07_SignOff"], "isController": true}, {"data": [1.0, 500, 1500, "01_Launch"], "isController": true}, {"data": [1.0, 500, 1500, "05_choose_Flights-18"], "isController": false}, {"data": [1.0, 500, 1500, "07_SignOff-22"], "isController": false}, {"data": [1.0, 500, 1500, "07_SignOff-21"], "isController": false}, {"data": [1.0, 500, 1500, "03_Click_Flights-13"], "isController": false}, {"data": [1.0, 500, 1500, "06_Payment"], "isController": true}, {"data": [1.0, 500, 1500, "06_Payment-19"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "03_Click_Flights-12"], "isController": false}, {"data": [1.0, 500, 1500, "03_Click_Flights-11"], "isController": false}, {"data": [1.0, 500, 1500, "01_Launch-2"], "isController": false}, {"data": [1.0, 500, 1500, "04_Find_Flights-17"], "isController": false}, {"data": [1.0, 500, 1500, "05_choose_Flights"], "isController": true}, {"data": [1.0, 500, 1500, "01_Launch-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "02_Click_Login"], "isController": true}, {"data": [1.0, 500, 1500, "04_Find_Flights"], "isController": true}, {"data": [1.0, 500, 1500, "01_Launch-1"], "isController": false}, {"data": [1.0, 500, 1500, "03_Click_Flights"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 225, 0, 0.0, 112.98222222222215, 0, 270, 121.0, 162.0, 185.79999999999995, 233.5400000000002, 2.6330571548939754, 4.2716666776377386, 1.7864447109195807], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["02_Click_Login-5", 15, 0, 0.0, 142.9333333333333, 125, 218, 137.0, 184.40000000000003, 218.0, 218.0, 0.36208269968860884, 0.6184400798392353, 0.2489318560359186], "isController": false}, {"data": ["02_Click_Login-4", 15, 0, 0.0, 105.6, 82, 205, 94.0, 155.20000000000005, 205.0, 205.0, 0.3614457831325301, 0.3116293298192771, 0.28659167921686746], "isController": false}, {"data": ["02_Click_Login-6", 15, 0, 0.0, 140.5333333333333, 116, 158, 137.0, 156.2, 158.0, 158.0, 0.36284470246734396, 0.41138935504354135, 0.24768403029753264], "isController": false}, {"data": ["07_SignOff", 15, 0, 0.0, 269.6, 236, 339, 266.0, 302.40000000000003, 339.0, 339.0, 0.2826508884659594, 0.767573818990371, 0.35331361058244926], "isController": true}, {"data": ["01_Launch", 15, 0, 0.0, 304.8, 217, 492, 237.0, 483.6, 492.0, 492.0, 3.163889474794347, 10.637754429445266, 4.8879620596920486], "isController": true}, {"data": ["05_choose_Flights-18", 15, 0, 0.0, 113.73333333333333, 99, 174, 108.0, 142.20000000000002, 174.0, 174.0, 0.26723201083180415, 0.7923185550319788, 0.2519914352140528], "isController": false}, {"data": ["07_SignOff-22", 15, 0, 0.0, 135.53333333333333, 118, 183, 133.0, 164.4, 183.0, 183.0, 0.28343064452128564, 0.48598391176804034, 0.15638507241652966], "isController": false}, {"data": ["07_SignOff-21", 15, 0, 0.0, 134.0666666666667, 113, 156, 134.0, 150.6, 156.0, 156.0, 0.2833663927458204, 0.2836431177387362, 0.19785836993482572], "isController": false}, {"data": ["03_Click_Flights-13", 15, 0, 0.0, 165.2, 137, 199, 161.0, 197.8, 199.0, 199.0, 0.36294127610152677, 1.6020454765418954, 0.2559019544387718], "isController": false}, {"data": ["06_Payment", 15, 0, 0.0, 109.73333333333332, 82, 155, 107.0, 133.4, 155.0, 155.0, 0.26737967914438504, 0.7552431483957219, 0.2988699030748663], "isController": true}, {"data": ["06_Payment-19", 15, 0, 0.0, 109.73333333333332, 82, 155, 107.0, 133.4, 155.0, 155.0, 0.2834842099295069, 0.8007321570313534, 0.3168711198098766], "isController": false}, {"data": ["Debug Sampler", 15, 0, 0.0, 2.0666666666666664, 0, 19, 1.0, 10.000000000000005, 19.0, 19.0, 0.2841285776523403, 0.2433590864319133, 0.0], "isController": false}, {"data": ["03_Click_Flights-12", 15, 0, 0.0, 138.93333333333337, 117, 172, 134.0, 168.4, 172.0, 172.0, 0.36310820624546114, 0.6201916530501089, 0.2556650553740014], "isController": false}, {"data": ["03_Click_Flights-11", 15, 0, 0.0, 86.73333333333333, 62, 113, 84.0, 104.0, 113.0, 113.0, 0.36354823073194376, 0.29928824072952015, 0.25490979459524965], "isController": false}, {"data": ["01_Launch-2", 15, 0, 0.0, 117.66666666666667, 76, 199, 84.0, 196.6, 199.0, 199.0, 3.5705784337062605, 3.574065326707927, 1.8375926118781245], "isController": false}, {"data": ["04_Find_Flights-17", 15, 0, 0.0, 114.86666666666667, 102, 146, 108.0, 144.8, 146.0, 146.0, 0.2962085308056872, 0.2848500135762243, 0.310421140649684], "isController": false}, {"data": ["05_choose_Flights", 15, 0, 0.0, 113.73333333333333, 99, 174, 108.0, 142.20000000000002, 174.0, 174.0, 0.2962260797440607, 0.8782833266682465, 0.2793319361336572], "isController": true}, {"data": ["01_Launch-3", 15, 0, 0.0, 162.26666666666668, 122, 270, 137.0, 251.4, 270.0, 270.0, 3.598848368522073, 6.164199331214011, 1.9962362044145872], "isController": false}, {"data": ["02_Click_Login", 15, 0, 0.0, 389.06666666666666, 335, 581, 376.0, 487.40000000000003, 581.0, 581.0, 3.4778576396939482, 12.881885071296082, 7.522678530025504], "isController": true}, {"data": ["04_Find_Flights", 15, 0, 0.0, 114.86666666666667, 102, 146, 108.0, 144.8, 146.0, 146.0, 0.36492798754379135, 0.3509343296881082, 0.3824378786127871], "isController": true}, {"data": ["01_Launch-1", 15, 0, 0.0, 24.86666666666667, 7, 114, 14.0, 80.40000000000002, 114.0, 114.0, 3.5410764872521248, 2.2961667847025495, 1.6840861809490086], "isController": false}, {"data": ["03_Click_Flights", 15, 0, 0.0, 390.8666666666666, 343, 482, 378.0, 458.0, 482.0, 482.0, 0.360915281153004, 2.5066694136329732, 0.7616581275113689], "isController": true}]}, function(index, item){
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
