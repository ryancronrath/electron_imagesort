
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    SetupEvents();
})

function SetupEvents() {
    document.getElementById('folder_input').addEventListener('change', function (e) { SelectFolder(e) });
}


function SelectFolder(e) {

    // Clear Table
    document.getElementById('imagelist_tbody').innerHTML = '';

    let count = 0;
    for (var i = 0; i < e.target.files.length; i++) {

        let imageName = e.target.files[i].name;
        //console.log(e.target.files[i]);
        AddRow(imageName, GetFileCreateDate(e.target.files[i].path));
        count += 1;
    }
    document.getElementById('imagecount_h').innerHTML = `Number of images found = ${count}`;

}

function AddRow(imageName, fileCreateDate) {

    let table = document.getElementById('imagelist_tbody');
    let rowCount = table.querySelectorAll('tr');
    let row = table.insertRow(rowCount.length);
    let cell1 = row.insertCell(0);
    cell1.innerHTML = imageName;
    let cell2 = row.insertCell(1);
    cell2.innerHTML = fileCreateDate


}

function GetFileCreateDate(path) {

    const fs = require('fs');
    var dateCreated = new Date(fs.statSync(path).birthtime);

    let day = dateCreated.getDate();
    let month = dateCreated.getMonth() + 1;
    let year = dateCreated.getFullYear();

    let createdate = `${month}/${day}/${year}`;

    return createdate;
}