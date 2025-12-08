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

    var data = {"OkPercent": 6.25, "KoPercent": 93.75};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.042682926829268296, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "02_Click_Login-5"], "isController": false}, {"data": [0.0, 500, 1500, "02_Click_Login-4"], "isController": false}, {"data": [0.0, 500, 1500, "02_Click_Login-6"], "isController": false}, {"data": [0.0, 500, 1500, "07_SignOff"], "isController": true}, {"data": [0.0, 500, 1500, "01_Launch"], "isController": true}, {"data": [0.0, 500, 1500, "05_choose_Flights-18"], "isController": false}, {"data": [0.0, 500, 1500, "07_SignOff-22"], "isController": false}, {"data": [0.0, 500, 1500, "07_SignOff-21"], "isController": false}, {"data": [0.0, 500, 1500, "03_Click_Flights-13"], "isController": false}, {"data": [0.0, 500, 1500, "06_Payment"], "isController": true}, {"data": [0.0, 500, 1500, "06_Payment-19"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.0, 500, 1500, "03_Click_Flights-12"], "isController": false}, {"data": [0.0, 500, 1500, "03_Click_Flights-11"], "isController": false}, {"data": [0.0, 500, 1500, "01_Launch-2"], "isController": false}, {"data": [0.0, 500, 1500, "04_Find_Flights-17"], "isController": false}, {"data": [0.0, 500, 1500, "05_choose_Flights"], "isController": true}, {"data": [0.0, 500, 1500, "01_Launch-3"], "isController": false}, {"data": [0.0, 500, 1500, "02_Click_Login"], "isController": true}, {"data": [0.0, 500, 1500, "04_Find_Flights"], "isController": true}, {"data": [0.0, 500, 1500, "01_Launch-1"], "isController": false}, {"data": [0.0, 500, 1500, "03_Click_Flights"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 224, 210, 93.75, 9465.852678571431, 0, 21127, 3079.5, 21070.5, 21076.0, 21090.0, 0.7455136056233026, 1.8288250630691198, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["02_Click_Login-5", 15, 15, 100.0, 3983.9333333333334, 2083, 21033, 2760.0, 10417.800000000007, 21033.0, 21033.0, 0.18266174697694806, 0.4718167194863552, 0.0], "isController": false}, {"data": ["02_Click_Login-4", 15, 15, 100.0, 3911.933333333334, 2184, 21079, 2725.0, 10358.200000000006, 21079.0, 21079.0, 0.23692565273017327, 0.6119808119836995, 0.0], "isController": false}, {"data": ["02_Click_Login-6", 15, 15, 100.0, 4067.866666666667, 2179, 21051, 2969.0, 10426.200000000006, 21051.0, 21051.0, 0.14909202954010078, 0.38510587708356114, 0.0], "isController": false}, {"data": ["07_SignOff", 15, 15, 100.0, 40714.53333333333, 21047, 42165, 42111.0, 42148.8, 42165.0, 42165.0, 0.0673406719701187, 0.33628686480911163, 0.0], "isController": true}, {"data": ["01_Launch", 15, 15, 100.0, 6461.533333333333, 6206, 7146, 6389.0, 7079.4, 7146.0, 7146.0, 1.377916590115745, 10.677507951726989, 0.0], "isController": true}, {"data": ["05_choose_Flights-18", 15, 15, 100.0, 18705.266666666666, 3434, 21127, 21058.0, 21096.4, 21127.0, 21127.0, 0.07328799249530958, 0.18930345717782598, 0.0], "isController": false}, {"data": ["07_SignOff-22", 14, 14, 100.0, 21055.5, 21030, 21084, 21051.5, 21078.5, 21084.0, 21084.0, 0.09779472886411422, 0.2526045486773263, 0.0], "isController": false}, {"data": ["07_SignOff-21", 15, 15, 100.0, 21062.733333333334, 21032, 21085, 21063.0, 21083.2, 21085.0, 21085.0, 0.06734097428921601, 0.1739422626904066, 0.0], "isController": false}, {"data": ["03_Click_Flights-13", 15, 15, 100.0, 9652.2, 2494, 21068, 3309.0, 21066.8, 21068.0, 21068.0, 0.09688107525076052, 0.2502445742561148, 0.0], "isController": false}, {"data": ["06_Payment", 15, 15, 100.0, 21069.733333333334, 21040, 21091, 21072.0, 21088.6, 21091.0, 21091.0, 0.06747031306225261, 0.1742763457516193, 0.0], "isController": true}, {"data": ["06_Payment-19", 15, 15, 100.0, 21069.733333333334, 21040, 21091, 21072.0, 21088.6, 21091.0, 21091.0, 0.06734188126279496, 0.17394460541024673, 0.0], "isController": false}, {"data": ["Debug Sampler", 14, 0, 0.0, 1.2857142857142856, 0, 9, 1.0, 5.5, 9.0, 9.0, 0.11467232383464251, 0.05786408974747516, 0.0], "isController": false}, {"data": ["03_Click_Flights-12", 15, 15, 100.0, 7445.866666666667, 2375, 21070, 3283.0, 21054.4, 21070.0, 21070.0, 0.10994568683070563, 0.283990568034391, 0.0], "isController": false}, {"data": ["03_Click_Flights-11", 15, 15, 100.0, 6423.333333333334, 2432, 21050, 2976.0, 20027.0, 21050.0, 21050.0, 0.12621694167935849, 0.3260193464276398, 0.0], "isController": false}, {"data": ["01_Launch-2", 15, 15, 100.0, 2074.6666666666665, 2054, 2090, 2077.0, 2089.4, 2090.0, 2090.0, 2.7711065952336966, 7.157789984758914, 0.0], "isController": false}, {"data": ["04_Find_Flights-17", 15, 15, 100.0, 17516.199999999997, 3053, 21076, 21059.0, 21073.0, 21076.0, 21076.0, 0.08294533349553754, 0.2142484444293914, 0.0], "isController": false}, {"data": ["05_choose_Flights", 15, 15, 100.0, 18705.266666666666, 3434, 21127, 21058.0, 21096.4, 21127.0, 21127.0, 0.0756536475145255, 0.1954139625741406, 0.0], "isController": true}, {"data": ["01_Launch-3", 15, 15, 100.0, 2099.0, 2054, 2251, 2083.0, 2228.8, 2251.0, 2251.0, 2.6920315865039486, 6.953538619436468, 0.0], "isController": false}, {"data": ["02_Click_Login", 15, 15, 100.0, 11963.733333333334, 7296, 63163, 8205.0, 31129.60000000002, 63163.0, 63163.0, 0.23577491354919838, 1.8270253310672746, 0.0], "isController": true}, {"data": ["04_Find_Flights", 15, 15, 100.0, 17516.199999999997, 3053, 21076, 21059.0, 21073.0, 21076.0, 21076.0, 0.08668566045804703, 0.22390973819485782, 0.0], "isController": true}, {"data": ["01_Launch-1", 15, 15, 100.0, 2287.866666666667, 2055, 2996, 2118.0, 2931.8, 2996.0, 2996.0, 2.3722916337181714, 6.127647823422426, 0.0], "isController": false}, {"data": ["03_Click_Flights", 15, 15, 100.0, 23521.399999999998, 8052, 63160, 9699.0, 62127.4, 63160.0, 63160.0, 0.09319432881444388, 0.7221650382252072, 0.0], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 209, 99.52380952380952, 93.30357142857143], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException", 1, 0.47619047619047616, 0.44642857142857145], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 224, 210, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 209, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["02_Click_Login-5", 15, 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["02_Click_Login-4", 15, 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["02_Click_Login-6", 15, 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["07_SignOff", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["05_choose_Flights-18", 15, 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["07_SignOff-22", 14, 14, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["07_SignOff-21", 15, 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["03_Click_Flights-13", 15, 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["06_Payment-19", 15, 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["03_Click_Flights-12", 15, 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["03_Click_Flights-11", 15, 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["01_Launch-2", 15, 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["04_Find_Flights-17", 15, 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["01_Launch-3", 15, 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["01_Launch-1", 15, 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 192.168.1.3:1080 [/192.168.1.3] failed: Connection refused (Connection refused)", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
