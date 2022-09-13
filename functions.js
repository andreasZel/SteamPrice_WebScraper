var img_search = document.getElementById("img_search");
var btn = document.getElementById("search_btn");
var ul = document.getElementById("Current_prices");
var gamenames = new Array;
var search = document.getElementById("game_name");

// For modal
var modal = document.getElementById("myModal");        // Get the modal
var body = document.getElementsByTagName("body");      // Get the main container and the body
var container = document.getElementById("myContainer");// Get the open button
var btnOpen = document.getElementById("myBtn");        //  Get the 
var btnClose = document.getElementById("closeModal");  //  close button

img_search.addEventListener("mouseover", function shadowopen() {
  img_search.style.borderRadius = "66px"
  img_search.style.boxShadow = "0px 0px 60px -3px #FFFF";
  img_search.style.backgroundColor = "#858585";
});

img_search.addEventListener("mouseout", function shadowopen() {
  img_search.style.borderRadius = ""
  img_search.style.boxShadow = "";
  img_search.style.backgroundColor = "";
});
// Open the modal
btnOpen.addEventListener("click", function open_modal() {

    modal.className = 'Modal is-visuallyHidden';
    setTimeout(function() {
      modal.className = 'Modal';
      container.className = 'container-fluid h-100 is-blurred';
    }, 100);
    container.parentElement.className = "ModalOpen";
});

// Close the modal
btnClose.addEventListener("click", function close_modal() {
    modal.className = "Modal is-hidden is-visuallyHidden";
    body.className = "";
    container.className = "container-fluid h-100";
    container.parentElement.className = "";
});

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", function(event) {
    if (event.target == modal) {
        modal.className = "Modal is-hidden";
        body.className = "";
        container.className = "container-fluid h-100";
        container.parentElement.className = "";
    }
});

btn.addEventListener("click", function press() {
    
    close_modal();
    start_date = document.getElementById("gdate_start");
    end_date = document.getElementById("date_end");
    document.getElementById("image").innerHTML = "";
    document.getElementById("result").innerHTML = "";
    document.getElementById("price").innerHTML = "";
    
    //ul.innerHTML = "";
    s = search.value;

    if (s.length == 0) {
      document.getElementById("result").innerHTML = "";
      return;
    } 
    else {
        document.getElementById("wait_msg").innerHTML = "results from steampricehistory.com all credits there";
        
        if (window.XMLHttpRequest) {
          var check = new XMLHttpRequest();
        }
        else {
          var check = new ActiveXObject("Microsoft.XMLHTTP");
        }
        check.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {

            // Put price, title and table to html
            var text = this.responseText;
            text = text.split("\n");
            var app_id_backup = text[0];
            var app_name = text[1];
            document.getElementById("price").innerHTML = text[2].substring(0, text[2].length - 1)+"\u20AC";
            document.getElementById("steam_shop").innerHTML = "<img src='steam.svg' alt='steam_image' width='94' height='94'>";
            document.getElementById("image").innerHTML = '<img src="' + text[3] + '"alt="game_image" width="324" height="151" id="img_bordered">';
            text.shift();text.shift();text.shift();text.shift();
            document.getElementById("wait_msg").innerHTML = "";
            
            // Get table info for the chart
            var price_info = new Array;
            const labels = new Array;
            const data = new Array;
            var j = 0;
            var reg_get_data = new RegExp('<td(.)*>(.)*</td>');
            var reg_mew_data = RegExp('</tr>');
            
            for (let i = 0; i < text.length; i++){

              if (reg_mew_data.test(text[i])){
                k = 0; j++;
                price_info[j] = new Array;
              }
                

              if (reg_get_data.test(text[i])){
                price_info[j][k] = text[i].substring(text[i].indexOf('>') + 1, text[i].indexOf('</td>'));
                k++;
              }
            }

            var table_area = document.getElementById("result");
            const table = document.createElement('table');
            table.setAttribute('id', 'price_table');
            table.style.textAlign = "center";table.style.fontSize = "20px";table.style.color = "white";
            const info_row = document.createElement('tr');
            const Date = document.createElement('td'); Date.innerHTML = "Date";
            const Price = document.createElement('td'); Price.innerHTML = "Price";
            const Gain = document.createElement('td'); Gain.innerHTML = "Gain";
            const Discount = document.createElement('td'); Discount.innerHTML = "Discount";
            info_row.appendChild(Date);info_row.appendChild(Price);info_row.appendChild(Gain);info_row.appendChild(Discount);
            table.appendChild(info_row);
            table_area.innerHTML = "";
            table_area.appendChild(table);

            for (let i = 1; i < price_info.length - 1; i++){

                var row = document.createElement('tr');

                var td = document.createElement('td');
                td.innerHTML = price_info[i][0];
                row.appendChild(td);

                var td = document.createElement('td');
                td.innerHTML = price_info[i][1];
                row.appendChild(td);

                var td = document.createElement('td');
                td.innerHTML = price_info[i][2];
                row.appendChild(td);

                var td = document.createElement('td');
                td.innerHTML = price_info[i][3];
                row.appendChild(td);

                table.appendChild(row);

                labels[i] = price_info[i][0];
                data[i] = price_info[i][1].substring(1, price_info[i][1].length);
            }

            var chartarea = document.getElementById("chart_area");
            const price_chart = document.createElement('canvas');
            price_chart.setAttribute('id', 'myChart');
            chartarea.appendChild(price_chart);
            price_chart.style.width = chartarea.style.width;
            price_chart.style.height = "387px";

            const chart_data = {
              labels: labels,
              datasets: [{
                label: 'Game Price Fluctuation',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: data,
              }]
            };

            const config = {
              type: 'line',
              data: chart_data,
              options: {
                plugins: { 
                  legend: {
                    labels: {
                      color: "white", 
                      font: {
                        size: 18
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    ticks: { color: 'white', beginAtZero: true }
                  },
                  x: {
                    ticks: { color: 'white', beginAtZero: true }
                  }
                }
              }
            };

            const myChart = new Chart(
              price_chart,
              config
            );
           
          }
        }

        check.open("GET", "calltoAPI.php?game=" + s, true);
        check.send();
    } 
  });

function get_gameid_with_api(){

  j = 0;
  if (window.XMLHttpRequest) {
    var request = new XMLHttpRequest();
  }
  else {
    var request = new ActiveXObject("Microsoft.XMLHTTP");
  }

  request.onreadystatechange = function () {
    if (this.readyState === 4 && this.status == 200) {

      var priceText = this.responseText;
      const prices_per_store = JSON.parse(priceText);
      
      for (let i = 0; i < prices_per_store.applist.apps.length; i++){
       
        if (prices_per_store.applist.apps[i].name != ""){
          gamenames[j] = prices_per_store.applist.apps[i].name;
          j++;
        }
      }
    }
  };
  // from http://api.steampowered.com/ISteamApps/GetAppList/v2/
  request.open('GET', 'games.txt');
  request.send();
} 


function showResults(value){
  res = document.getElementById("relative_games");
  res.innerHTML = '';
  let list = '';
  let terms = autocompleteMatch(value);
  for (i=0; i<terms.length; i++) {
    //add an onclick event in the li to get the text to input area
    list += '<li onclick="get_content(this);">' + terms[i] + '</li>';
  }
  res.innerHTML = '<ul>' + list + '</ul>';
}

function autocompleteMatch(input) {
  
  if (input == '') {
    return [];
  }

  reg = '^'+input.substring(0, input.length)+'(.)*';
  var j = 0;
  var term = new Array;
  var reg = new RegExp(reg, "i");

  for (let i = 0; i < gamenames.length; i ++){
    
    if (reg.test(gamenames[i])){
      term[j] = gamenames[i];
      j++;
    }
  }

  return term;
}

function get_game_data(app_id, app_name){

  var request = new XMLHttpRequest();

  request.open('GET', `https://api.isthereanydeal.com/v01/game/prices/?key=336d4d68f89d11c84dfb7064fcd38c3bd22a1230&shops=steam&plains=${app_name}&country=GR&ids=${app_id}`);

  request.onreadystatechange = function () {
    if (this.readyState === 4) {
      
      var priceText = this.responseText;
      const prices_per_store = JSON.parse(priceText);

      const info_list = prices_per_store.data[app_name].list;

      for (const info of info_list) { 

        const listItem = document.createElement('li');
        listItem.textContent = info.price_new;
        listItem.textContent += "\n";
        listItem.textContent += info.url;
        listItem.textContent += "\n";
        listItem.textContent += info.shop.id;
        ul.appendChild(listItem);
      }

    }
  };

  request.send();
  }

  function get_content(selected_div){
    search.value = selected_div.innerHTML;
  }

function close_modal() {
  modal.className = "Modal is-hidden is-visuallyHidden";
  body.className = "";
  container.className = "container-fluid h-100";
  container.parentElement.className = "";
}