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

    const getName = document.getElementById("search-bar");
    // alert(getName.value);
    const res = new XMLHttpRequest();
    // res.open("GET", `${api}/timezone/${getContinent.value}/${getCity.value}`);
    res.open("GET", `${api}/search?name=${getName.value}`);

    res.onreadystatechange = () => {
        if (res.readyState == 4) {
            if (res.status == 200) {
                // console.log(res.responseText);
                const resultsDiv = document.getElementById("result-table");
                resultsDiv.innerHTML = "";
                const date = document.createElement("div");
                const resText = JSON.parse(res.responseText);
                const datetime = {date: resText.datetime.split("T")[0], time: resText.datetime.split("T")[1]};
                datetime.date = {day: datetime.date.split("-")[2], month: datetime.date.split("-")[1], year: datetime.date.split("-")[0]};
                datetime.time = {hour: datetime.time.split(":")[0], minute: datetime.time.split(":")[1]}
                date.innerHTML = `${datetime.date.day}/${datetime.date.month}/${datetime.date.year}`;
                resultsDiv.appendChild(date);
                const time = document.createElement("div");
                time.innerHTML = `${datetime.time.hour}:${datetime.time.minute}`
                resultsDiv.appendChild(time);
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
