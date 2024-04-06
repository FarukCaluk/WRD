
let globalPodaci = [];
let preuzmi = () => {
    //https://restapiexample.wrd.app.fit.ba/ -> Ispit20230715 -> GetPonuda

    let url = `https://restapiexample.wrd.app.fit.ba/Ispit20230715/GetPonuda?travelfirma=${firma.value}`
    destinacije.innerHTML = '';//brisemo destinacije koje su hardkodirane (tj. nalaze se u HTML-u)
    fetch(url)
        .then(r => {
            if (r.status !== 200) {
                //greska
                return;
            }
            r.json().then(t => {

                let b = 0;
                globalPodaci = t.podaci //setujemo globalnu varijablu

                for (const x of t.podaci) {
                    destinacije.innerHTML += `
                    <article class="offer">
                        <div class="akcija">Polazak za <br>${x.naredniPolazak.zaDana} dana</div>
                        <div class="offer-image" style="background-image: url('${x.imageUrl}');" ></div>
                        <div class="offer-details">
                            <div class="offer-destination">${x.mjestoDrzava}</div> 
                            <div class="offer-description">${x.opisPonude} </div>                                       
                            <div class="offer-description">${x.opisPonude} </div>                                       
                            <div class="offer-price">${x.naredniPolazak.cijenaEUR} €</div>
                            <br> 
                            <div class="offer-free">
                                <label>
                                    Slobodno mjesta: 
                                </label>
                                <span>
                                    ${x.naredniPolazak.brojSlobodnihMjesta}
                                </span>
                            </div> 
                        </div>
                        


                        <div class="offer-footer">
                            <div class="ponuda-dugme" onclick="odaberiDestinaciju(${b})">Pogledaj</div>
                        </div>
                    </article>
                    `
                    b++;
                }
            })
        })
}

let odaberiDestinaciju=(rb)=>{

    let destinacijObj = globalPodaci[rb];
    destinacija.value=destinacijObj.mjestoDrzava;
    generisiPlaniranaPutovanja(destinacijObj.planiranaPutovanja);
}

let generisiPlaniranaPutovanja = (putovanjaNiz) =>{

    let s = "";
    for (const o of putovanjaNiz) {
        s += `
        <tr>
            <td>ID ${o.id}</td>
            <td>${o.datumPolaska}</td>
            <td>${o.datumPovratka}</td>
            <td>${o.hotelOpis}</td>
            <td>${o.vrstaPrevoza}</td>
            <td>${o.cijenaEUR} €</td>
            <td><button onclick="odaberiPutovanje('${o.datumPolaska}', ${o.cijenaEUR})">Odaberi</button></td>
        </tr>`
    }
    putovanjaTabela.innerHTML = s;
}

let odaberiPutovanje=(datumPolaskaValue, cijenaEUR)=>{
    datumPolaska.value = datumPolaskaValue;
    cijenaPoGostu.value = cijenaEUR;
    promjenaBrojaGostiju();
}

const osvjeziCijenu=()=>{
    let cijenaPoGostuValue = Number(cijenaPoGostu.value);
    ukupnaCijena.value = Number(brojGostiju.value) * cijenaPoGostuValue;
}
let ErrorBackgroundColor = "#FE7D7D";
let OkBackgroundColor = "#DFF6D8";

let posalji = () => {
    //https://restapiexample.wrd.app.fit.ba/ -> Ispit20230715 -> Add


    let jsObjekat = new Object();

    jsObjekat.travelFirma=firma.value;
    jsObjekat.destinacijaDrzava=destinacija.value;
    jsObjekat.brojIndeksa=brojIndeksa.value;
    jsObjekat.gosti=[]; //prazan niz koji se tek puni u linijama ispod
    jsObjekat.poruka=messagetxt.value;
    jsObjekat.telefon=phone.value;
    jsObjekat.datumPolaska= datumPolaska.value;

    document.querySelectorAll(".imegostaklasa").forEach(f=>{
        jsObjekat.gosti.push(f.value);
    })

    let jsonString = JSON.stringify(jsObjekat);

    console.log(jsObjekat);

    let url = "https://restapiexample.wrd.app.fit.ba/Ispit20230715/Add";

    //fetch tipa "POST" i saljemo "jsonString"
    fetch(url, {
        method: "POST",
        body: jsonString,
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
                
                if (t.idRezervacije>0 && Number(ukupnaCijena.value)>0)
                {
                    dialogSuccess(`Idi na placanje rezervacije broj ${t.idRezervacije} - iznos ${ukupnaCijena.value} EUR`, ()=>{
                        window.location = `https://www.paypal.com/cgi-bin/webscr?business=adil.joldic@yahoo.com&cmd=_xclick&currency_code=EUR&amount=${ukupnaCijena.value}&item_name=Dummy invoice`
                    });
                }
            })

        })
}

let popuniFimeUCombox = () => {
    let urlFirme = "https://restapiexample.wrd.app.fit.ba/Ispit20230624/GetTravelFirme";

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

                preuzmi();
            })
        })
        .catch(error => {
            window.alert("Greska!" + error);
        })
}
popuniFimeUCombox();


let promjenaBrojaGostiju = () => {
    gosti.innerHTML='';
    if(brojGostiju.value>5){
        console.log("Dosegnut maksimum gostiju!");
        return;
    }
    for (let i=0;i<brojGostiju.value;i++){
        gosti.innerHTML+=
        `<div class="item-full">
            <label>Ime gosta ${i+1}</label>
            <input class="imegostaklasa" />
        </div>`
    }
    osvjeziCijenu();
}


let provjeriTelefon=()=> {
    let r = /^\+[0-9]{3}-[0-9]{2}-[0-9]{3}-[0-9]{3}$/;
    if (!r.test(phone.value)) {
       phone.style.backgroundColor=ErrorBackgroundColor;
    }
    else {
        phone.style.backgroundColor=OkBackgroundColor;
    }
}

let provjeriBrojIndeksa=()=>{
    let r = /^IB[0-9]{6}$/;
    if (!r.test(brojIndeksa.value)) {
       brojIndeksa.style.backgroundColor=ErrorBackgroundColor;
    }
    else {
        brojIndeksa.style.backgroundColor=OkBackgroundColor;
    }
}