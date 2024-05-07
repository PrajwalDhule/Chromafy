# Chromafy

A Chrome extension that lets you generate and apply color palettes to any website with just a few clicks with high level of customization.

## UI Design

![Demo Video](https://github.com/PrajwalDhule/Chromafy/assets/89639472/accf8e82-1e40-4f8c-9eee-573e832a1302)


## Installation

i. Fork the repo into your account

ii. Clone the project into your local machine

```sh
git clone https://github.com/<Your-name>/Chromafy.git
```

**Chromafy Extension**

1. Navigate to the folder

```sh
cd chromafy-extension
```
then
```sh
cd chromafy-app
```

2. Install the dependencies

```sh
npm install
```

3. Run the project on local machine

```sh
npm run dev
```

*If you've made any changes*

4. Build the react app

```sh
npm run build
```

5. Get the name of the newly built contentScript file from the assets folder inside the build (dist) folder
![contentScript build file](https://github.com/PrajwalDhule/Chromafy/assets/89639472/64c858d2-3c84-423f-8d34-7901288e8ef4)

6. Navigate back by one directory
```sh
cd ..
```

7. Update the previous contentScript file name with the current one in injectReactApp function inside contentScript.js
![contentScript file name update](https://github.com/PrajwalDhule/Chromafy/assets/89639472/f1493167-b84e-4eb3-9e4c-f22ae1f70607)

**To upload the chrome extension and use it on your device** 

8. go to ``chrome://extensions/`` in your browser, click ``load unpacked`` and select the ``chromafy-extension`` folder

![load chrome extension](https://github.com/PrajwalDhule/Chromafy/assets/89639472/a28b5600-60d8-46ad-b289-3a458127eccd)



**Chromafy Website**

(From the root directory)

1. Navigate to the folder

```sh
cd chromafy-website
```

2. Install the dependencies

```sh
npm install
```

3. Run the project on local machine

```sh
npm run dev
```

### Where can I go for help, or just contact?

If you need help, you can email at:
- [**Email**](chromafy.contact@gmail.com)

Or connect with me on
- [**Twitter**](https://twitter.com/prajwaldhule36)
- [**Linkedin**](https://www.linkedin.com/in/prajwal-dhule)

## License

[CC BY-NC-ND](LICENSE.md)
