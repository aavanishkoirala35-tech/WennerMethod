let resistanceChart;

/* =====================================
ADD INSTRUMENT
===================================== */

function addInstrumentRow(){

    const tbody =
    document.querySelector(
        "#instrumentTable tbody"
    );

    const rowCount =
    tbody.rows.length + 1;

    const row =
    document.createElement("tr");

    row.innerHTML = `

        <td>${rowCount}</td>

        <td>
            <input type="text">
        </td>

        <td>
            <input type="text">
        </td>

        <td>
            <input type="date">
        </td>

    `;

    tbody.appendChild(row);

}

/* =====================================
ADD READING ROW
===================================== */

function addReadingRow(){

    const tbody =
    document.querySelector(
        "#readingTable tbody"
    );

    const row =
    document.createElement("tr");

    row.innerHTML = `

        <td>
            <input type="number" class="spacing-input" value="1">
        </td>

        <td>
            <input type="number" class="ohm-input" value="0">
        </td>

        <td>
            <input type="text" class="c1-input">
        </td>

        <td>
            <input type="text" class="p1-input">
        </td>

        <td>
            <input type="text" class="p2-input">
        </td>

        <td>
            <input type="text" class="c2-input">
        </td>

        <td>
            <input type="number" class="depth-input" value="0">
        </td>

        <td>
            <input type="number" class="t1-input" value="0">
        </td>

        <td>
            <input type="number" class="t2-input" value="0">
        </td>

        <td class="average-cell">0.00</td>

        <td class="resistivity-cell">0.00</td>

    `;

    tbody.appendChild(row);

}

/* =====================================
CALCULATE
===================================== */

function calculateData(){

    const rows =
    document.querySelectorAll(
        "#readingTable tbody tr"
    );

    let resistivityValues = [];
    let depthValues = [];

    rows.forEach((row)=>{

        const spacing =
        parseFloat(row.querySelector(".spacing-input").value) || 0;

        const ohm =
        parseFloat(row.querySelector(".ohm-input").value) || 0;

        const depth =
        parseFloat(row.querySelector(".depth-input").value) || 0;

        const t1 =
        parseFloat(row.querySelector(".t1-input").value) || 0;

        const t2 =
        parseFloat(row.querySelector(".t2-input").value) || 0;

        // average ONLY display purpose
        const average =
        (t1 + t2) / 2;

        // ✔ CORRECT WENNER RESISTIVITY FORMULA
        const resistivity =
        2 * Math.PI * spacing * average;

        row.querySelector(".average-cell").innerText =
        average.toFixed(2);

        row.querySelector(".resistivity-cell").innerText =
        resistivity.toFixed(2);

        resistivityValues.push(resistivity);
        depthValues.push(depth);

    });

    // RESULTS

    const avgResistivity =
    resistivityValues.reduce((a,b)=>a+b,0)
    / resistivityValues.length;

    const maxResistivity =
    Math.max(...resistivityValues);

    const minResistivity =
    Math.min(...resistivityValues);

    document.getElementById("avgResistivity").innerText =
    avgResistivity.toFixed(2) + " Ωm";

    document.getElementById("maxResistivity").innerText =
    maxResistivity.toFixed(2) + " Ωm";

    document.getElementById("minResistivity").innerText =
    minResistivity.toFixed(2) + " Ωm";

    document.getElementById("totalObservations").innerText =
    resistivityValues.length;

    // ✔ CHART FIX (RESISTIVITY vs DEPTH)
    generateChart(depthValues, resistivityValues);
}

/* =====================================
CHART
===================================== */

function generateChart(labels, data){

    const ctx =
    document.getElementById("resistanceChart").getContext("2d");

    if(resistanceChart){
        resistanceChart.destroy();
    }

    resistanceChart =
    new Chart(ctx,{

        type:"line",

        data:{

            labels:labels, // depth

            datasets:[{

                label:"Soil Resistivity (Ωm) vs Depth (cm)",

                data:data,

                borderColor:"#003366",
                backgroundColor:"rgba(0,51,102,0.1)",
                tension:0.3,
                fill:true

            }]

        },

        options:{

            responsive:true,
            maintainAspectRatio:false,

            scales:{

                x:{
                    title:{
                        display:true,
                        text:"Depth (cm)"
                    }
                },

                y:{
                    title:{
                        display:true,
                        text:"Resistivity (Ωm)"
                    }
                }

            }

        }

    });
}

/* =====================================
MAP
===================================== */

function updateMap(){

    document.getElementById(
        "mapFrame"
    ).src =
    document.getElementById(
        "mapUrl"
    ).value;

}

updateMap();

/* =====================================
IMAGE PREVIEW
===================================== */

function previewImage(event,id){

    const reader =
    new FileReader();

    reader.onload = function(){

        document.getElementById(
            id
        ).src =
        reader.result;

    };

    reader.readAsDataURL(
        event.target.files[0]
    );

}

/* =====================================
PDF
===================================== */

function generateProfessionalPDF(){

    saveReportData();

    window.open(
        "pdf.html",
        "_blank"
    );

}

/* =====================================
SAVE REPORT DATA
===================================== */

function saveReportData(){

    const observations = [];

    document.querySelectorAll(
        "#readingTable tbody tr"
    ).forEach(row=>{

        observations.push({

            spacing:
            row.querySelector(".spacing-input").value,

            ohm:
            row.querySelector(".ohm-input").value,

            c1:
            row.querySelector(".c1-input").value,

            p1:
            row.querySelector(".p1-input").value,

            p2:
            row.querySelector(".p2-input").value,

            c2:
            row.querySelector(".c2-input").value,

            depth:
            row.querySelector(".depth-input").value,

            t1:
            row.querySelector(".t1-input").value,

            t2:
            row.querySelector(".t2-input").value,

            average:
            row.querySelector(".average-cell").innerText,

            resistivity:
            row.querySelector(".resistivity-cell").innerText

        });

    });

    const data = {

        projectName:
        document.getElementById("projectName").value,

        projectReference:
        document.getElementById("projectReference").value,

        location:
        document.getElementById("location").value,

        date:
        document.getElementById("date").value,

        engineer:
        document.getElementById("engineer").value,

        weather:
        document.getElementById("weather").value,

        remarks:
        document.getElementById("remarks").value,

        avgResistivity:
        document.getElementById("avgResistivity").innerText,

        maxResistivity:
        document.getElementById("maxResistivity").innerText,

        minResistivity:
        document.getElementById("minResistivity").innerText,

        observations,

        map:
        document.getElementById("mapUrl").value,

        chart:
        resistanceChart
        ?
        resistanceChart.toBase64Image()
        :
        "",

        img1:
        document.getElementById("img1").src,

        img2:
        document.getElementById("img2").src,

        desc1:
        document.getElementById("desc1").value,

        desc2:
        document.getElementById("desc2").value

    };

    localStorage.setItem(
        "wennerReport",
        JSON.stringify(data)
    );

}

/* =====================================
SAVE HISTORY
===================================== */

function saveHistory(){

    saveReportData();

    const data =
    JSON.parse(
        localStorage.getItem(
            "wennerReport"
        )
    );

    let history =
    JSON.parse(
        localStorage.getItem(
            "wennerHistory"
        )
    ) || [];

    data.savedDate =
    new Date().toLocaleString();

    history.push(data);

    localStorage.setItem(

        "wennerHistory",

        JSON.stringify(history)

    );

    alert(
        "History Saved Successfully"
    );

}