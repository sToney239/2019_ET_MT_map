function dummy() {
  console.log('dummy');
  return [];
}
function localgeocoder(query) {
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
        feature['center'] = feature.geometry.coordinates;
        matchingFeatures.push(feature);
      }
    }
  )

  return Promise.resolve(matchingFeatures);
};
function validateQuestion() {
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
        if (this.id === `link-${feature.properties.id}` & feature.properties.city != "NA") {
          popup.remove();
          flyToCity(feature);
        };
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
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 5
  });   
}
function changeName() {
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
  