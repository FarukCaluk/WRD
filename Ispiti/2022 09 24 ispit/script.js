
let preuzmi = () => {
    //https://restapiexample.wrd.app.fit.ba/ -> Ispit20220924 -> GetPonuda

    let url = `https://restapiexample.wrd.app.fit.ba/Ispit20220924/GetPonuda?travelfirma=${firma.value}`
    destinacije.innerHTML = '';//brisemo destinacije koje su hardkodirane (tj. nalaze se u HTML-u)
    let b = 0;
    fetch(url)
        .then(r => {
            if (r.status !== 200) {
                //greska
                return;
            }
            r.json().then(t => {

                for (const x of t.podaci) {
                    b++;
                    destinacije.innerHTML += `
                    <article class="offer" onclick="okvir(this)">
                        <div class="akcija">${x.akcijaPoruka}</div>
                        <div  class="offer-image" style="background-image: url('${x.imageUrl}');" ></div>
                        <div class="offer-details">
                            <div class="offer-destination">${x.mjestoDrzava}</div>
                            <div class="offer-price">$${x.cijenaDolar}</div>
                            <div class="offer-description">${x.opisPonude}</div>
                            <div class="offer-firma">${x.travelFirma.naziv}</div>
                            <select id="s${b}" class="offer-option">
                                        ${generisiOpcije(x)}
                                </select>                        
                        </div>
                        <div class="ponuda-dugme-1" onclick="dest1(this)">Odaberi za destinaciju 1</div>
                        <div class="ponuda-dugme-2" onclick="dest2(this)">Odaberi za destinaciju 2</div>
                    </article>
                `
                }
            })
        })
}

function okvir(a) {
    document.querySelectorAll(".offer").forEach(f => f.style.border = "");
    a.style.border = "5px solid yellow";
}

function generisiOpcije(x) {
    let s = "";
    for (const o of x.opcije) {
        s += `<option>${o}</option>`
    }
    return s;
}
function dest1(inf){
    
    let naziv = inf.parentElement.querySelector(".offer-destination").innerHTML 
    let soba = inf.parentElement.querySelector(".offer-option").value
    let cena=inf.parentElement.querySelector(".offer-price").innerHTML
    s9.value=soba;
    destinacija1.value=naziv+soba
    cijena1.value=cena
  
}

function dest2(inf){
    
    let naziv2 = inf.parentElement.querySelector(".offer-destination").innerHTML 
    let soba2 = inf.parentElement.querySelector(".offer-option").value
    let cena2=inf.parentElement.querySelector(".offer-price").innerHTML
    s9.value=soba2;
    destinacija2.value=naziv2+soba2
    cijena2.value=cena2
}
let ErrorBackgroundColor = "#FE7D7D";
let OkBackgroundColor = "#DFF6D8";

function provjeriPrezime() {
    let r = /^[A-Za-z]{1,2}[a-z]{1,9}$/
   if(!r.test(lastname.value)){
    lastname.style.backgroundColor=ErrorBackgroundColor
   }
   else{
    lastname.style.backgroundColor=OkBackgroundColor

   }
}

function provjeriIme() {
    let r = /^[A-Za-z]{1,2}[a-z]{1,9}$/
   if(!r.test(firstname.value)){
    firstname.style.backgroundColor=ErrorBackgroundColor
   }
   else{
    firstname.style.backgroundColor=OkBackgroundColor

   }
}
function provjeriEmail() {
    let r = /^[A-Za-z0-9._%+-]+@edu\.fit\.ba$/
    if(!r.test(email.value)){
        email.style.backgroundColor=ErrorBackgroundColor
    }
    else{
        email.style.backgroundColor=OkBackgroundColor
 
    }
}


function provjeriPhone() {
    let r = /^\+[0-9]{3}$/
    if(!r.test(phone.value)){
        phone.style.backgroundColor=ErrorBackgroundColor
    }
    else{
        phone.style.backgroundColor=OkBackgroundColor
 
    }
}


let posalji = () => {
    //https://restapiexample.wrd.app.fit.ba/ -> Ispit20220924 -> Add


    //korak4: pripemiti url varijablu (copy-paste iz swaggera)
    let url = "https://restapiexample.wrd.app.fit.ba/Ispit20220924/Add";
    //korak5: fetch tipa "POST" i saljemo "s"
    fetch(url, {
        method: "POST",
        body: s4,//ili s1 ili s2 ili s3 ili s4
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then(r => {
            if (r.status != 200) {
                alert("Greška")
                return;
            }

            r.json().then(t => {
                alert("Uspješna rezervacija. Broj rezervacije je: " + t.brojRezervacije)

            })

        })
}

function popuniFimeUCombox() {
    let urlFirme = "https://restapiexample.wrd.app.fit.ba/Ispit20220924/GetTravelFirme";

    fetch(urlFirme)
        .then(obj => {
            if (obj.status != 200) {
                window.alert("Greska pri komunikaciji sa serverom!");
                return;
            }
            obj.json().then(element => {
                element.forEach(e => {
                    firma.innerHTML += `<option>${e.naziv}</option>`;
                });
            })
        })
        .catch(error => {
            window.alert("Greska!" + error);
        })
}

popuniFimeUCombox();


function racunajNovuUkupnuCijenu() {
    let c1=Number(cijena1.value.substring(1))
    let c2=Number(cijena2.value.substring(1))

    cijenaukupno.value = c1*c2
}