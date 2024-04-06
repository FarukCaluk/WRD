
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
                        <div class="ponuda-dugme-1" onclick="odabir1('${x.mjestoDrzava}', ${x.cijenaDolar}, ${b})">Odaberi za destinaciju 1</div>
                        <div class="ponuda-dugme-2" onclick="odabir2(this)">Odaberi za destinaciju 2</div>
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

function odabir1(d, c, b) {
    let soba = document.getElementById("s" + b).value;//npr let soba = s1.value

    destinacija1.value = d + ", " + soba;//u textbox "destinacija1" upisujemo cijenu drzavu "d" i sobu "soba"
    cijena1.value = c;//u textbox "cijena1" upisujemo cijenu "c"

    ukupnoPoOsobi.value = c + Number(cijena2.value);
}

function odabir2(dugme) {
    let d = dugme.parentElement.querySelector(".offer-destination").innerHTML;
    let c = Number(dugme.parentElement.querySelector(".offer-price").innerHTML.substring(1));
    let s = dugme.parentElement.querySelector(".offer-option").value;

    destinacija2.value = d + ", " + s;//u textbox "destinacija2" upisujemo cijenu drzavu "d" i sobu "s"
    cijena2.value = c;//u textbox "cijena2" upisujemo cijenu "c"

    ukupnoPoOsobi.value = c + Number(cijena1.value);
}

function generisiOpcije(x) {
    let s = "";
    for (const o of x.opcije) {
        s += `<option>${o}</option>`
    }
    return s;
}


let ErrorBackgroundColor = "#FE7D7D";
let OkBackgroundColor = "#DFF6D8";

function provjeriIme() {
    let r = /^[a-zA-Z- ]+$/

    let poruke = ""

    document.querySelectorAll(".firstname").forEach(t => {
        if (!r.test(t.value)) {
            t.style.backgroundColor = ErrorBackgroundColor;
            poruke += "Pogresno ime,";
        }
        else {
            t.style.backgroundColor = OkBackgroundColor;
        }
    })

    return poruke;
}

function provjeriEmail() {
    let r = /^[a-zA-Z0-9._%+-]+@edu\.fit\.ba$/
    if (!r.test(email.value)) {
        email.style.backgroundColor = ErrorBackgroundColor;
        return "Pogresan email,";
    }
    else {
        email.style.backgroundColor = OkBackgroundColor;
        return "";
    }
}


function provjeriTelefon() {
    let r = /^\+\d{3}-\d{2}-\d{3}-\d{3,4}$/
    if (!r.test(email.value)) {
        email.style.backgroundColor = ErrorBackgroundColor;
        return "Pogresan email,";
    }
    else {
        email.style.backgroundColor = OkBackgroundColor;
        return "";
    }
}


let posalji = () => {
    //https://restapiexample.wrd.app.fit.ba/ -> Ispit20220924 -> Add

    //korak1: preuzeti vrijednosti iz input kontrola (text boxovi)
    let d1 = destinacija1.value;
    let d2 = destinacija2.value;
    
    let poruka = messagetxt.value;
    let telefon = phone.value;
    let mail = email.value;

    //korak2: validacija podataka i ispit greske po potrebi
    let greske = "";
    greske += provjeriIme();
    greske += provjeriEmail();
    //itd za ostale textboxove

    if (greske.length > 0) {
        alert("greske su: " + greske);
        return;//prekid funkcije
    }
    //korak3: priprema json stringa - string kopirajte iz swaggera
    /*
    let s1 = `{
    "destinacija1Soba": "${d1}",
    "destinacija2Soba": "${d2}",
    "imeGosta": "${ime}",
    "prezimeGosta": "${prezime}",
    "poruka": "${poruka}",
    "email": "${mail}",
    "telefon": "${telefon}"
  }`;
    //ili
    let s2 = JSON.stringify({
        "destinacija1Soba": d1,
        "destinacija2Soba": d2,
        "imeGosta": ime,
        "prezimeGosta": prezime,
        "poruka": poruka,
        "email": mail,
        "telefon": telefon
    });
    //ili
    let s3 = JSON.stringify({
        destinacija1Soba: d1,
        destinacija2Soba: d2,
        imeGosta: ime,
        prezimeGosta: prezime,
        poruka: poruka,
        email: mail,
        telefon: telefon
    });
*/
    //ili
    let o4 = new Object();
    o4.destinacija1Soba = d1;
    o4.destinacija2Soba = d2;

    o4.gosti = []

    document.querySelectorAll(".firstname").forEach(f=>{
        o4.gosti.push({
            imeGosta: f.value          
        })
    })

    //o4.imeGosta = ime;
    //o4.prezimeGosta = prezime;
    o4.poruka = poruka;
    o4.email = mail;
    o4.telefon = telefon;

    let s4 = JSON.stringify(o4);

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
    let br = Number(brojOsoba.value);
    let cij = Number(ukupnoPoOsobi.value);

    ukupnoSve.value = br * cij;

    gosti.innerHTML = ""; //brise stare textboxove

    
    for (let i = 0; i < br; i++) {
        gosti.innerHTML +=
            `  <div class="container">
                <div class="item">
                    <label for="firstname">Gost  ${i+1}: First name</label>
                    <input type="text" class="firstname" oninput="provjeriIme()" />
                </div>
                <div class="item">
                    <label for="lastname">Gost  ${i+1}: Last name</label>
                    <input type="text" class="lastname" />
                </div>
            </div>`;

    }
}