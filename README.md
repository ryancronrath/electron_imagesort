# Image Sort

Image Sort is a work in progress and a first attempt working with npm and electron.  The purpose of the application is to take a directory of images, review the EXIF data - if any, and sort the images into a folder based on the EXIF create date.

## Run Locally

Clone the project

```bash
  git clone https://github.com/ryancronrath/electron_imagesort.git
```

Go to the project directory

```bash
  cd electron_imagesort/src
```

Install dependencies

```bash
  npm install
```

Start the app

```bash
  npm start
```


## Features

- Searches for EXIF data on the following file types
    - .JPG/JPEG
    - .NEF
    - .PNG


## Roadmap

- Additional sorting methods using regex to look at the file name and get the date.


## Deployment

To deploy this project run following command from /src folder

```bash
  npx electron-packager . 'ImageSort' --all  --out="//path/to/out/directory"
```

## Authors

- [@ryancronrath](https://github.com/ryancronrath)


## License

[MIT](https://choosealicense.com/licenses/mit/)

