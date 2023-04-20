import './css/styles.css';
import API from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const DEBOUNCE_DELAY = 300;

const refs={
    input: document.querySelector('#search-box'),
    ul: document.querySelector('.country-list'),
    div: document.querySelector('.country-info'),
}

refs.input.addEventListener('input', debounce(onInputCountry, DEBOUNCE_DELAY));

function onInputCountry(){
    const searchCountry=refs.input.value.trim();
    console.log('searchCountry=', searchCountry);
    if(searchCountry!==''){
        API.fetchCountries(searchCountry)
        .then(renderCountriesInfo)
        .catch(onFetchError);
        // .finally(refs.input.value='');
    }
    else{
        clearMarkup();
    }

    
   
}

function renderCountriesInfo(arrayCountries){
    console.log(arrayCountries);
  
    if(arrayCountries.length>10){
        clearMarkup();
        Notify.info("Too many matches found. Please enter a more specific name.");
    }
    else if(arrayCountries.length<10 && arrayCountries.length>1){
        clearMarkup();
        createMarkupListCountries(arrayCountries);  
        
    }else{
        clearMarkup();
        createMarkupCountryCard(arrayCountries);
    }
}

function createMarkupListCountries(arr) {
     const markup=[...arr].sort((a,b)=>a.name.common.localeCompare(b.name.common))
       .map(
         ({
           flags: {svg, alt},
           name:{common},
         }) => `<li class="country-item">
         <div class="thumb">
        <img src="${svg}" alt="${alt}" width="50px" height="30px"/></div>      
        <p>${common}</p></li>`
       )
       .join("");
       
       console.log(markup);

       refs.ul.innerHTML=markup;
  }
 
function createMarkupCountryCard(arr){
    console.log(arr);
    const [array]=arr;
    console.log('array=', array)
    const {
        flags: {svg, alt},
        name:{common},
        capital,
        languages,
        population

    }=array;
    const capitalCountry=capital[0];
    console.log('languages=', languages);

    const langValues=Object.values(languages).join(', ');
    console.log('langValues=', langValues);

    const markup=`<div class="country-thumb"><img src="${svg}" alt="${alt}" width="50px" height="30px"/><p class="country-name">${common}</p></div><p class="country-description">Capital: <span class="country-value">${capitalCountry}</span></p><p class="country-description">Population: <span class="country-value">${population}</span></p><p class="country-description">Languages: <span class="country-value">${langValues}</span></p>`;  
    console.log(markup);
    refs.div.innerHTML=markup;    
}

function onFetchError(){
    clearMarkup();
    Notify.failure("Oops, there is no country with that name");
  
}

function clearMarkup(){
    refs.ul.innerHTML='';
    refs.div.innerHTML='';    
}