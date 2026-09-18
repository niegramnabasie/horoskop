const signs = [
  {key:"aries", name:"Baran", symbol:"♈", dates:"21 marca – 19 kwietnia"},
  {key:"taurus", name:"Byk", symbol:"♉", dates:"20 kwietnia – 20 maja"},
  {key:"gemini", name:"Bliźnięta", symbol:"♊", dates:"21 maja – 20 czerwca"},
  {key:"cancer", name:"Rak", symbol:"♋", dates:"21 czerwca – 22 lipca"},
  {key:"leo", name:"Lew", symbol:"♌", dates:"23 lipca – 22 sierpnia"},
  {key:"virgo", name:"Panna", symbol:"♍", dates:"23 sierpnia – 22 września"},
  {key:"libra", name:"Waga", symbol:"♎", dates:"23 września – 22 października"},
  {key:"scorpio", name:"Skorpion", symbol:"♏", dates:"23 października – 21 listopada"},
  {key:"sagittarius", name:"Strzelec", symbol:"♐", dates:"22 listopada – 21 grudnia"},
  {key:"capricorn", name:"Koziorożec", symbol:"♑", dates:"22 grudnia – 19 stycznia"},
  {key:"aquarius", name:"Wodnik", symbol:"♒", dates:"20 stycznia – 18 lutego"},
  {key:"pisces", name:"Ryby", symbol:"♓", dates:"19 lutego – 20 marca"}
];

const API = "https://sigastra.com/api/v1/daily?lang=pl&full=1";
const cards = document.getElementById("cards");

document.getElementById("date").textContent =
  new Intl.DateTimeFormat("pl-PL",{day:"numeric",month:"long",year:"numeric"}).format(new Date()).toUpperCase();

function escapeHTML(value){
  const div=document.createElement("div");
  div.textContent=value ?? "";
  return div.innerHTML;
}

function getItemKey(item){
  return String(item.sign || item.key || item.slug || "")
    .toLowerCase()
    .replace("bliźnięta","gemini");
}

function makeCard(sign, text){
  return `
    <article class="card">
      <div class="symbol">${sign.symbol}</div>
      <div class="card-head">
        <h2>${sign.name}</h2>
        <div class="dates">${sign.dates}</div>
      </div>
      <p class="text">${escapeHTML(text || "Dzisiejszy horoskop jest chwilowo niedostępny.")}</p>
    </article>
  `;
}

async function loadHoroscopes(){
  try{
    const response = await fetch(API);
    if(!response.ok) throw new Error("API error");

    const data = await response.json();
    const items = Array.isArray(data.items) ? data.items : [];

    const byKey = {};
    items.forEach(item => {
      const k = getItemKey(item);
      if(k) byKey[k] = item.text.split('\n\n')[0] || "";

    });

    cards.innerHTML = signs.map(sign =>
      makeCard(sign, byKey[sign.key])
    ).join("");

    // Use the attribution URL returned by the API when available.
    if(data.attribution?.localizedHref){
      const link=document.getElementById("credit");
      link.href=data.attribution.localizedHref;
      link.textContent=data.attribution.text || "Powered by Sigastra";
    }
  }catch(error){
    cards.innerHTML = `
      <div class="loading error">
        Nie udało się pobrać dzisiejszych horoskopów.<br>
        Sprawdź połączenie z internetem.
      </div>`;
  }
}

loadHoroscopes();
