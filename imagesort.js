const ExifImage = require('exif').ExifImage;
const Luxon = require('luxon').DateTime;
const fs = require('fs');
const path = require('path')


// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    SetupEvents();
})

function SetupEvents() {

    // Select Folder Click
    document.getElementById('folder_input').addEventListener('change', function (e) {
        document.getElementById('imagelist_tbody').innerHTML = '';  // Clear Table
        document.getElementById('migration_message').style.display = 'none';
        SelectFolder(e)
    });

    // Approve Migration Click
    document.getElementById('migrate_button_yes').addEventListener('click', function (){

        let migrateList = [];

        let imageList = document.getElementById('imagelist_tbody').querySelectorAll('tr');
        for (i = 0; i < imageList.length; i++){

            let cells = imageList[i].querySelectorAll('td');

            let imageName = cells[0].innerHTML;
            let imagePath = cells[0].dataset.path;
            let imageDate = cells[1].innerHTML;
            let migrateImage = cells[2].innerHTML;

            if (migrateImage === "Y"){
                migrateList.push({name: imageName, path: imagePath, date: imageDate});
            }
        }

        MigrateFiles(migrateList);
        document.getElementById('imagelist_tbody').innerHTML = '';  // Clear Table
        document.getElementById('migration_message').style.display = 'inline';
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
                ReviewImageData(file);
                imageList.push(file);
            }
        }
        else {
            break;
        }
    }

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

function AddRow(path, name, date, migrate) {
    let table = document.getElementById('imagelist_tbody');
    let rowCount = table.querySelectorAll('tr');
    let row = table.insertRow(rowCount.length);
    let cell1 = row.insertCell(0);
    cell1.innerHTML = name;
    cell1.dataset.path = path;
    let cell2 = row.insertCell(1);
    cell2.innerHTML = date;
    let cell3 = row.insertCell(2);
    cell3.innerHTML = migrate;
}

function ReviewImageData(file) {
    try {
        new ExifImage({ image : file.path }, function (error, exifData) {
            if (error) {
                AddRow(file.path, file.name, "No EXIF Data Found", "N");
                //console.log('EXIF Error: ' + error.message);
            }
            else {
                var date = Luxon.fromFormat(exifData.exif.CreateDate, "yyyy:MM:dd HH:mm:ss");        
                let day = date.day;
                let month = date.month;
                let year = date.year;

                if (month < 10){
                    month = `0${month}`;
                }
                if (day < 10){
                    day = `0${day}`;
                }

                let createdate = `${year}-${month}-${day}`;

                AddRow(file.path, file.name, createdate, "Y");
            }         
        });

    } catch (error) {
        AddRow(file.path, file.name, "Error Reading Data from File", "N");
        //console.log('Error: ' + error.message);
    }
}

function MigrateFiles(filelist){
    for (i = 0; i < filelist.length; i++){
        let parent = path.dirname(filelist[i].path);
        let newPathDir = path.join(parent, filelist[i].date);

        // Create dated folder if it doesn't exist.
        if (!fs.existsSync(newPathDir)){
            fs.mkdir(newPathDir, (err) => console.log(err));
        }

        fs.rename(filelist[i].path, path.join(newPathDir, filelist[i].name), function(err){
            if (err){
                console.log(err);
            }
        });
    }
}
