// Tallennetaan solmut taulukkoon objekteina
// x ja y ovat prosenttiosuuksia, verkkokartta-alueen koosta.
const verkonSolmut = [
    { id: "SRV-01", x: 10, y:20 },
    { id: "RTR-A",  x: 25, y: 5 },
    { id: "RTR-B",  x: 50, y: 20 },
    { id: "RTR-C",  x: 80, y: 10 },
    { id: "SRV-02", x: 90, y: 25 },
    { id: "RTR-D",  x: 85, y: 75 },
    { id: "RTR-E",  x: 50, y: 70 },
    { id: "SRV-03", x: 15, y: 85 }
];

// Määritellään kaapeliyhteydet
const verkonKaapelit = [
    { mistä: "SRV-01", mihin: "RTR-A" },
    { mistä: "RTR-A",  mihin: "RTR-B" },
    { mistä: "RTR-B",  mihin: "RTR-C" },
    { mistä: "RTR-C",  mihin: "SRV-02" },
    { mistä: "SRV-02", mihin: "RTR-D" },
    { mistä: "RTR-D",  mihin: "RTR-E" },
    { mistä: "RTR-E",  mihin: "SRV-03" },
    { mistä: "SRV-03", mihin: "SRV-01" },
    { mistä: "SRV-01", mihin: "RTR-D" },
    { mistä: "RTR-A",  mihin: "RTR-D" },
    { mistä: "RTR-B",  mihin: "RTR-E" },
    { mistä: "RTR-C",  mihin: "SRV-03" },
    { mistä: "SRV-02", mihin: "RTR-E" }
];

// Piirtää solmut näytölle
function alustaSolmut() {
    const alustaSivu = document.getElementById('networkContainer');

    // Käydään jokainen solmu läpi
    verkonSolmut.forEach(solmu => {

        // Luodaan uusi tyhjä <div> elementti solmua varten
        const solmuElementti = document.createElement("div");

        // Annetaan CSS luokka
        solmuElementti.className = 'network-node';

        // Sijoitetaan solmu oikeaan kohtaan prosenttien avulla
        solmuElementti.style.left = solmu.x + "%";
        solmuElementti.style.top = solmu.y + "%";

        // Luodaan solmulle sisäosa taustaväriä ja tekstiä varten
        const sisaosa = document.createElement("div");
        sisaosa.className = "node-internal";
        sisaosa.textContent = solmu.id;

        // Laitetaan sisäosa solmu-elementin sisälle
        solmuElementti.appendChild(sisaosa);

        // Lopuksi liitetään koko solmu näkyviin verkkokarttaan
        alustaSivu.appendChild(solmuElementti);
    });
}

// Piirtää kaapelit solmujen välille
function alustaKaapelit() {
    const svgAlusta = document.getElementById('svgCanvas');

    // Käydään läpi kaikki kaapelit
    verkonKaapelit.forEach(kaapeli => {

        // Etsitään lähtösolmun tiedot
        const lahtoSolmu = verkonSolmut.find(solmu => solmu.id === kaapeli.mistä);

        // Etsitään kohdesolmun tiedot
        const kohdeSolmu = verkonSolmut.find(solmu => solmu.id === kaapeli.mihin);

        // Jos molemmat solmut löytyivät, piirretään viiva
        if (lahtoSolmu && kohdeSolmu) {

            // SVG elementtejä luodessa pitää selaimelle kertoa virallinen osoite
            const svgNamespace = "http://www.w3.org/2000/svg";
            const viiva = document.createElementNS(svgNamespace, "line");

            // Asetetaan viivalle luokka tyylitiedostoa varten
            viiva.classList.add('network-cable');

            // Määritellään mistä prosenttipisteestä viiva alkaa
            viiva.setAttribute("x1", lahtoSolmu.x);
            viiva.setAttribute("y1", lahtoSolmu.y);

            // Määritellään mihin prosenttipisteeseen viiva päättyy
            viiva.setAttribute("x2", kohdeSolmu.x);
            viiva.setAttribute("y2", kohdeSolmu.y);

            console.log(`Viiva: ${lahtoSolmu.id}(${lahtoSolmu.x},${lahtoSolmu.y}) → ${kohdeSolmu.id}(${kohdeSolmu.x},${kohdeSolmu.y})`);

            // Liitetään valmis viiva SVG-alustan sisälle näkyviin
            svgAlusta.appendChild(viiva);
        }
    });
}

// Sovelluksen tila
const tila = {
    lahdeId: null,
    kohdeId: null,
    reitti: [],
    kokonaisViive: 0
};

// Solmujen valinta klikkaamalla
function valitseSolmu() {
    const solmuElementit = document.querySelectorAll('.network-node');

    solmuElementit.forEach((elementti, indeksi) => {
        elementti.addEventListener('click', function(e) {
            e.stopPropagation();

            // Etsitään lähdesolmun ID
            const solmuId = verkonSolmut[indeksi].id;

            // Jos ei ole valittua lähdettä, aseta se
            if (tila.lahdeId === null) {
                tila.lahdeId = solmuId;
                korostaSolmut();
                console.log(`Lähde valittu: ${solmuId}`);
                return;
            }

            // Jos lähde on jo valittu, mutta kohde ei, aseta kohde
            if (tila.kohdeId === null && solmuId !== tila.lahdeId) {
                tila.kohdeId = solmuId;
                korostaSolmut();
                console.log(`Kohde valittu: ${solmuId}`);

                laskeReitti();
                return;
            }

            // Jos klikataan jo valittua solmua, nollataan valinta
            if (solmuId === tila.lahdeId || solmuId === tila.kohdeId) {
                tila.lahdeId = null;
                tila.kohdeId = null;
                tila.reitti = [];
                korostaSolmut();
                poistaReitinKorostus();
                console.log('Valinnat nollattu');
                return;
            }

            // Muuten vaihdetaan lähde ja nollataan kohde
            tila.lahdeId = solmuId;
            tila.kohdeId = null;
            tila.reitti = [];
            korostaSolmut();
            poistaReitinKorostus();
            console.log(`Lähde vaihdettu: ${solmuId}`);
        });
    });
}

// Solmujen korostus
function korostaSolmut() {
    const solmuElementit = document.querySelectorAll('.network-node');
    const solmuTeksti = document.querySelectorAll('.node-internal');

    solmuElementit.forEach((elementti, indeksi) => {
        const solmuId = verkonSolmut[indeksi].id;
        const tekstiElementti = solmuTeksti[indeksi];

        // Poistetaan vanhat korostukset
        elementti.style.border = 'none';
        elementti.style.boxShadow = 'none';
        elementti.style.background = 'linear-gradient(135deg, var(--neon-cyan) 0%, rgba(0, 240, 255, 0.6) 100%)';
        tekstiElementti.style.color = '';

        // Lisää uudet korostukset
        if (solmuId === tila.lahdeId) {
            elementti.style.border = '3px solid #39FF14';
            elementti.style.boxShadow = '0 0 20px rgba(57, 255, 20, 0.6)';
            elementti.style.background = 'linear-gradient(135deg, var(--neon-green) 0%, rgba(57, 255, 20, 0.6) 100%)';
            tekstiElementti.style.color = '#39FF14';
        } else if (solmuId === tila.kohdeId) {
            elementti.style.border = '3px solid #39FF14';
            elementti.style.boxShadow = '0 0 20px rgba(57, 255, 20, 0.6)';
            elementti.style.background = 'linear-gradient(135deg, var(--neon-green) 0%, rgba(57, 255, 20, 0.6) 100%)';
            tekstiElementti.style.color = '#39FF14';
        }
    });
}

// Reitin korostuksen poisto
function poistaReitinKorostus() {
    const kaapelit = document.querySelectorAll('.network-cable');

    kaapelit.forEach(kaapeli => {
        kaapeli.style.stroke = 'rgba(0, 240, 255, 0.4)';
        kaapeli.style.strokeWidth = '3';
    });
}

// Piirretaan solmut ja yhteydet
window.onload = function() {
    alustaSolmut();
    alustaKaapelit();
    valitseSolmu();
    console.log('Sovellus käynnistetty! Klikkaa solmuja valitaksesi lähteen ja kohteen.');
};