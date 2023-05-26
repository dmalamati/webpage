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
    const res = new XMLHttpRequest();
    res.open("GET", `${api}/search?name=${getName.value}`);

    res.onreadystatechange = () => {
        if (res.readyState == 4) {
            if (res.status == 200) {

                const resText = JSON.parse(res.responseText);
                const tableBody = document.getElementById("result-table");
                while (tableBody.rows.length > 1) {
                    tableBody.deleteRow(1);
                }

                resText.forEach((item) => {
                    const row = document.createElement("tr");

                    const id_cell = document.createElement("td");
                    id_cell.innerText = item["_id"];
                    row.appendChild(id_cell);

                    const name_cell = document.createElement("td");
                    name_cell.innerText = item["name"];
                    row.appendChild(name_cell);

                    const production_year_cell = document.createElement("td");
                    production_year_cell.innerText = item["production_year"];
                    row.appendChild(production_year_cell);

                    const price_cell = document.createElement("td");
                    price_cell.innerText = item["price"];
                    row.appendChild(price_cell);

                    const color_cell = document.createElement("td");
                    color_cell.innerText = item["color"];
                    row.appendChild(color_cell);

                    const size_cell = document.createElement("td");
                    size_cell.innerText = item["size"];
                    row.appendChild(size_cell);

                    // for (let key in item) {
                    //     const cell = document.createElement("td");
                    //     cell.innerText = item[key];
                    //     row.appendChild(cell);
                    // }

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

    res.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    res.send(JSON.stringify({
        "name": getName.value,
        "production_year": parseInt(getProduction_year.value),
        "price": parseInt(getPrice.value),
        "color": parseInt(getColor.value),
        "size": parseInt(getSize.value)
    }));
    // END CODE HERE
}
