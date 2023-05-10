const api = "http://127.0.0.1:5000";

window.onload = () => {
    // BEGIN CODE HERE
    const searchButton = document.getElementById("search-button");
    searchButton.onclick = searchButtonOnClick;
    const saveButton = document.getElementById("save-button");
    saveButton.onclick = productFormOnSubmit;
    // END CODE HERE
}

searchButtonOnClick = () => {
    // BEGIN CODE HERE

    const getName = document.getElementById("search-input");
    // alert(getName.value);
    const res = new XMLHttpRequest();
    // res.open("GET", `${api}/timezone/${getContinent.value}/${getCity.value}`);
    res.open("GET", `${api}/search?name=${getName.value}`);

    res.onreadystatechange = () => {
        if (res.readyState == 4) {
            if (res.status == 200) {
                // const resultsDiv = document.getElementById("result-table");

                const resText = JSON.parse(res.responseText);
                const tableBody = document.getElementById("result-table");
                tableBody.innerHTML = "";

                // Δημιουργούμε γραμμές και κελιά για κάθε αντικείμενο στο resText
                resText.forEach((item) => {
                    const row = document.createElement("tr");

                    for (let key in item) {
                        const cell = document.createElement("td");
                        cell.innerText = item[key];
                        row.appendChild(cell);
                    }

                    // Προσθέτουμε τη γραμμή στο tbody του πίνακα
                    tableBody.appendChild(row);
                });
            }
        }
    };
    res.send();
    // END CODE HERE
}

productFormOnSubmit = () => {
    // BEGIN CODE HERE
    const getName = document.getElementById("Name");
    const getProduction_year = document.getElementById("Production-year");
    const getPrice = document.getElementById("Price");
    const getColor = document.getElementById("Color");
    const getSize = document.getElementById("Size");

    const res = new XMLHttpRequest();
    res.open("POST", `${api}/add-product`);
    res.onreadystatechange = () => {
        if (res.readyState == 4) {
            if (res.status == 200) {
                alert(res.responseText);
            }
        }
    };
    // same for the project
    res.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    // change input (inside the JSON stringify)for the project
    res.send(JSON.stringify({
        "name": getName.value,
        "production_year": parseInt(getProduction_year.value),
        "price": parseInt(getPrice.value),
        "color": parseInt(getColor.value),
        "size": parseInt(getSize.value)
    }));
    // END CODE HERE
}
