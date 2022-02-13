
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    SetupEvents();
})

function SetupEvents() {
    document.getElementById('folder_input').addEventListener('change', function (e) {
        document.getElementById('imagelist_tbody').innerHTML = '';  // Clear Table
        SelectFolder(e)
    });
}


function SelectFolder(e) {
    let imageList = [];
    let directory = '';  // Stores the initial directory.

    for (let i = 0; i < e.target.files.length; i++) {
        let file = e.target.files[i];

        // Set the directory to the first directory that contains a file
        if (directory === '') {
            directory = file.path.replace(file.name, '');
        }

        // This prevents further sub folders from being accessed.  Only if the original directory 
        // contains the file will the file be added.
        if (directory + file.name == file.path) {

            if (IsImage(file.name) === true) {
                let image = { name: file.name, path: file.path, date: GetFileCreateDate(file.path) };
                imageList.push(image);
            }
        }
        else {
            break;
        }
    }
    console.table(imageList);

    AddRows(imageList);

    // Set display count and directory
    document.getElementById('imagecount_h').innerHTML = `Number of images found = ${imageList.length}`;
    document.getElementById('searchFolder_h').innerHTML = `Folder: ${directory}`;
}

function IsImage(filename) {

    let name = filename.toLowerCase();

    if (name.endsWith('.jpg') || name.endsWith('.jpeg')) {
        return true;
    }
    else if (name.endsWith('.nef')) {
        return true;
    }
    else if (name.endsWith('.gif')) {
        return true;
    }
    else if (name.endsWith('.png')) {
        return true;
    }
    else {
        return false;
    }
}

function AddRows(imageList, directory) {
    for (let i = 0; i < imageList.length; i++) {
        AddRow(imageList[i]);
    }
}

function AddRow(image) {

    let table = document.getElementById('imagelist_tbody');
    let rowCount = table.querySelectorAll('tr');
    let row = table.insertRow(rowCount.length);
    let cell1 = row.insertCell(0);
    cell1.innerHTML = image.name;
    let cell2 = row.insertCell(1);
    cell2.innerHTML = image.date;
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
