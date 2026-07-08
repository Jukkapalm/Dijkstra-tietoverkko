// Tallennetaan solmut taulukkoon objekteina
// x ja y ovat prosenttiosuuksia, verkkokartta-alueen koosta.
const verkonSolmut = [
    { id: "SRV-01", x: 15, y:25 },
    { id: "RTR-A",  x: 45, y: 15 },
    { id: "RTR-B",  x: 45, y: 50 },
    { id: "RTR-C",  x: 45, y: 85 },
    { id: "SRV-02", x: 85, y: 50 }
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

window.onload = alustaSolmut;