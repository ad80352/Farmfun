mapboxgl.accessToken = 'pk.eyJ1IjoiYzEyMzQxOCIsImEiOiJjbDc2OTk2dnExemZvM3BtdmFlM25jb2YwIn0.HbDVH1mKa7vS2-LuRkstrA';
        const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: farm.geometry.coordinates, // starting position [lng, lat]
        zoom: 12, // starting zoom
        projection: 'globe' // display the map as a 3D globe
        });
        map.on('style.load', () => {
        map.setFog({}); // Set the default atmosphere style
        });

// 設定圖釘
new mapboxgl.Marker()
    .setLngLat(farm.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 20})
        .setHTML(
            `<h5 class="fw-bold">${farm.title}</h5>`
        )
    )
    .addTo(map);

// 設定地圖語言
mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js');
map.addControl(new MapboxLanguage({
      defaultLanguage: 'zh-Hant'
    }));