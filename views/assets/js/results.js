
(function() {

  document.querySelector('#printPageButton').addEventListener('click',()=>{
    window.print();
  });

  let gdf = {
    name: [],
    value: [],
  };
  document.querySelectorAll('tr.family').forEach( family => {
    gdf.name.push( family.querySelector('td.name').innerText );
    gdf.value.push( parseFloat(family.querySelector('td.gdf').innerText) );
  });

  var familias_ctx = document.getElementById('familiasChart').getContext('2d');
  var familiasChart = new Chart(familias_ctx, {
    type: 'bar',
    data: {
      labels: gdf.name,
      datasets: [{
        label: 'Grau de Deterioração da Família',
        backgroundColor: '#f5cb5c',
        borderColor: 'rgb(0, 0, 0)',
        data: gdf.value,
      }]
    },
    // Configuration options go here
    options: {
      scales: {
        xAxes: [{
          barThickness: 40,
          maxBarThickness: 70,
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
          }
        }]
      },
    },
  });

  let damages = {
    name: [],
    value: [],
  };
  document.querySelectorAll('tr.damage').forEach( family => {
    damages.name.push( family.querySelector('td.name').innerText );
    damages.value.push( parseFloat(family.querySelector('td.percentage').innerText) );
  });

  var danos_ctx = document.getElementById('danosChart').getContext('2d');
  var danosChart = new Chart(danos_ctx, {
    type: 'bar',
    data: {
      labels: damages.name,
      datasets: [{
        label: 'Ocorrência de danos',
        backgroundColor: '#f5cb5c',
        borderColor: 'rgb(0, 0, 0)',
        data: damages.value,
      }]
    },
    // Configuration options go here
    options: {
      scales: {
        xAxes: [{
          barThickness: 40,
          maxBarThickness: 70,
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
          }
        }]
      },
    },
  });

})();
