
(function() {

  let gdf = {
    name: [],
    value: [],
  };
  document.querySelectorAll('tr.family').forEach( family => {
    gdf.name.push( family.querySelector('td.name').innerText );
    gdf.value.push( parseFloat(family.querySelector('td.gdf').innerText) );
  });

  var ctx = document.getElementById('familiasChart').getContext('2d');
  var chart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: gdf.name,
          datasets: [{
              label: 'Grau de Deterioração da Família',
              backgroundColor: 'rgb(255, 99, 132)',
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
          },
      },
  });

})();
