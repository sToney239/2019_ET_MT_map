function popupText(current_city) {
  var { pinyin } = pinyinPro;
  let positions = {
      w1: -1,
      w2: -1
  };
  current_city.forEach((city, index) => {
    if (city.properties.name === "王颂洋") {
      positions.w1 = index;
    }
    if (city.properties.name === "王晓昀") {
       positions.w2 = index;
    }
  });
  if (positions.w1 !== -1 && positions.w2 !== -1 && current_city.length > 2) {
    if (positions.w1 > 0) {
      let temp = current_city[positions.w1-1];
      current_city[positions.w1-1] = current_city[positions.w1];
      current_city[positions.w1] = temp;
      } else {
        let temp = current_city[positions.w2+1];
        current_city[positions.w2+1] = current_city[positions.w2];
        current_city[positions.w2] = temp;
      };
    };

    var base_text = '<h1 style="text-align:center;margin:0;padding:8px 0 8px 0">' + current_city[0].properties.city + "<\h1>";

    base_text += '<table>';
    row_number = Math.ceil(current_city.length / 5);

    for (j=0;j<row_number;j++) {
      base_text += '<tr>';
      for (i = 0; (j * 5 + i) < Math.min(current_city.length, (j+1) * 5); i++) {
        base_text += '<td>' +
          '<img src="pics/' + pinyin(current_city[(j * 5 + i)].properties.name, { toneType: 'none', v: "true" }).replace(/\s*/g, "").toLowerCase() +
          '.jpg" alt="Local Image" width="85" height="85" /> ' +
          '</td>';
      }
      base_text += '</tr>' + '<tr>';

      for (i = 0; (j * 5 + i) < Math.min(current_city.length, (j+1) * 5); i++) {
        base_text += '<th>' + current_city[(j * 5 + i)].properties.name + '</th>';
      }
      base_text += '</tr>' + '<tr>';
      for (i = 0; (j * 5 + i) < Math.min(current_city.length, (j+1) * 5); i++) {
        base_text += '<td style="color:gray;font-size:12px">' + '最后更新于:<br/>' + current_city[(j * 5 + i)].properties.modified_date + '</td>';
      }
      base_text += '</tr>';
  }

  base_text += '</table>';
  return base_text;
}

function clearPopups() {
  const popups = document.getElementsByClassName("mapboxgl-popup");
  if (popups.length) {
    popups[0].remove();
  }
}

function localgeocoder(query) {
  var { pinyin } = pinyinPro;
  var matchingFeatures = [];
  name_data.features.forEach(
    feature => {
      if (pinyin(feature.properties.name, { toneType: 'none', v: "true" }).replace(/\s*/g, "").toLowerCase().
        search(pinyin(query, { toneType: 'none', v: "true" }).replace(/\s*/g, "").toLowerCase()) !== -1) {
        feature['place_name'] = feature.properties.name;
        feature['center'] = feature.geometry.coordinates;
        matchingFeatures.push(feature);
      }

      if (pinyin(feature.properties.name, { toneType: 'none', pattern: 'first', v: "true" }).replace(/\s*/g, "").toLowerCase().
        search(pinyin(query, { toneType: 'none', pattern: 'first', v: "true" }).replace(/\s*/g, "").toLowerCase()) !== -1) {
        feature['place_name'] = feature.properties.name;
        feature['city'] = feature.properties.city;
        feature['center'] = feature.geometry.coordinates;
        matchingFeatures.push(feature);
      }
    }
  )

  return Promise.resolve(matchingFeatures);
};

function validateQuestion() {
  var { pinyin } = pinyinPro;
  var theAnswer = document.getElementById("question").value;
  //var correctAnswer = decodeURIComponent(escape(atob(questionsData.filter((t) => { return t.id == randQuest; })[0].answ)));
  var correctAnswer = atou(questionsData.filter((t) => { return t.id == randQuest; })[0].answ);
  var theAnswerPinyin = pinyin(theAnswer, { toneType: 'none', v: "true" }).replace(/\s*/g, "").toLowerCase();
  var correctAnswerPinyin = pinyin(correctAnswer, { toneType: 'none', v: "true" }).replace(/\s*/g, "").toLowerCase();
  //console.log(decodeURI(encodeURI(atob(questionsData[randQuest - 1].ques))));
  var theAnswerPinyinFirst = pinyin(theAnswer, { toneType: 'none', pattern: 'first', v: "true" }).replace(/\s*/g, "").toLowerCase();
  var correctAnswerPinyinFirst = pinyin(correctAnswer, { toneType: 'none', pattern: 'first', v: "true" }).replace(/\s*/g, "").toLowerCase();
  if (theAnswer == correctAnswer|theAnswer==correctAnswerPinyin|theAnswer==correctAnswerPinyinFirst|theAnswerPinyin==correctAnswerPinyin|theAnswerPinyinFirst==correctAnswerPinyinFirst) {
    return true;
  } else {
    return false;
  }
}
function naMessage() {
  clearPopups();
  const toastContainer = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = "errorToast show";
  toast.innerHTML = `
      😭还是去问问本人吧
  `;

  toastContainer.appendChild(toast);

  const toastTimeout = setTimeout(function() {
      toast.classList.remove("show");
      setTimeout(() => {
          toastContainer.removeChild(toast);
      }, 800); 
  }, 1000); 

  toast.querySelector(".close-btn").addEventListener("click", function() {
      clearTimeout(toastTimeout);
      toast.classList.remove("show");
      setTimeout(() => {
          toastContainer.removeChild(toast);
      }, 1000);
  });
  
}
function buildLocationList(classmates) {
  for (const classmate of classmates.features) {
    const listings = document.getElementById('listings');
    const listing = listings.appendChild(document.createElement('div'));
    listing.id = `listing-${classmate.properties.id}`;
    listing.className = 'item';

    const link = listing.appendChild(document.createElement('a'));
    link.href = '#';
    link.className = 'title';
    link.id = `link-${classmate.properties.id}`;
    link.innerHTML = `${classmate.properties.name}`;

    const details = listing.appendChild(document.createElement('div'));
    details.innerHTML = '<p style="font-size:12px;color:black;margin:0;line-height:1;"></p>'
    if (classmate.properties.city != "NA") {
      details.innerHTML += `${classmate.properties.city}`;
    } else {
      details.innerHTML += `&#128557 还是去问问本人吧`;
    }
    details.innerHTML +='</p>'
    if (classmate.properties.modified_date) {
      details.innerHTML += `<p style="font-size:12px;color:gray;margin:0;line-height:1;">最后更新于: ${classmate.properties.modified_date}</p>`;
    }

    link.addEventListener('click', function () {
      for (const feature of classmates.features) {
        if (this.id === `link-${feature.properties.id}`) {
          if (feature.properties.city != "NA") {
            flyToCity(feature);
          } else {
            naMessage();
          }
      }
    }
      
      const activeItem = document.getElementsByClassName('active');
      if (activeItem[0]) {
        activeItem[0].classList.remove('active');
      }
      this.parentNode.classList.add('active');
    });
  }
}

function flyToCity(currentFeature) {
  clearPopups();
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 4
  });   
  var current_city = name_data.features.filter(function (e) { return e.properties.city == currentFeature.properties.city; });
  smoothPopup(currentFeature.geometry.coordinates, current_city)
}

function smoothPopup(coord, text){
  setTimeout(function () {
    popupStatus = 0;
    // const popup = new mapboxgl.Popup() 
    var popup = new AnimatedPopup({
      offset: 0,
      openingAnimation: {
          duration: 300,
          easing: 'easeOutSine',
          transform: 'scale'
      },
      closingAnimation: {
          duration: 300,
          easing: 'easeInSine',
          transform: 'scale'
      }}).setLngLat(coord) 
      .setHTML(popupText(text))
      .setMaxWidth("1000px")
      .addTo(map);
  }, 500);
}

function decryptName() {
  for(i in name_data.features){
    //name_data.features[i].properties.name = decodeURIComponent(escape(name_data.features[i].properties.name);
    //console.log(name_data.features[i].properties.name);
    name_data.features[i].properties.name = atou(name_data.features[i].properties.name);
    name_data.features[i].properties.city = atou(name_data.features[i].properties.city);
  }
}

function atou(b64) {
    let text = window.atob(b64);
    let stringAvecPourcentage = "";
    for (var i = 0; i < text.length; i++) {
      let caractere = text.charAt(i);
      if(!/^[\x00-\x7F]*$/.test(caractere)){ 
        let nombre = caractere.charCodeAt(0); 
        let hexString = nombre.toString(16); 
        let speChar = "%" + hexString; 
        stringAvecPourcentage += speChar;
      }
      else{ 
        stringAvecPourcentage += caractere;
      }
    }
    return decodeURIComponent(stringAvecPourcentage); 
  }

function quizReRoll() {
  var selectedElement = document.getElementById("qusetion-name");
  newQuestionsData = questionsData.filter((t) => {
    return t.id != randQuest;
  })
  randQuest = newQuestionsData[Math.floor(Math.random() * newQuestionsData.length)].id;
  selectedElement.innerHTML = atou(questionsData.filter((t) => { return t.id == randQuest; })[0].ques);
  popup.setDOMContent(divElement);
}

function mapInitializeAfterQuiz() {
  buildLocationList(name_data);
  map.setLayoutProperty("circle-layer", 'visibility', 'visible');
  map.setLayoutProperty("circle-city-labels", 'visibility', 'visible');
  const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      localGeocoder: e => { [] },
      localGeocoderOnly: true,
      externalGeocoder: localgeocoder,
      setAutocomplete: true,
      setFuzzyMatch: true,
      marker:false,
      flyTo: false,
      zoom: 4,
      placeholder: '试试人名搜索? (缩写也行的)',
      mapboxgl: mapboxgl
    });

  map.addControl(geocoder);

  geocoder.on('result', e1 => {
    if (e1.result.city != "NA") {
      clearPopups();
      map.flyTo({
        center: e1.result.geometry.coordinates,
        zoom: 4
      });   
      exact_city = e1.result.city;
      popupStatus = 1;
      var current_city = name_data.features.filter(function (e) { return e.properties.city == e1.result.city; });
      smoothPopup(e1.result.geometry.coordinates, current_city)
    } else {
      naMessage();
    }
    geocoder.clear();
    
  });
}
