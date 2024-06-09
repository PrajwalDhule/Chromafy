# Chromafy

A Developer Tool in the form of a Web extension that lets you generate and apply color palettes to any website with just a few clicks with high level of customization.

## Demo

[![**Chromafy Demo Video**](https://img.youtube.com/vi/X3rUIZoolqU/0.jpg)](https://www.youtube.com/watch?v=X3rUIZoolqU)

## Major Links

Chrome Extension: ![Chrome Extension Link](https://chromewebstore.google.com/detail/chromafy/cnlpinepheadkoncomndblbajnalpljn)
Firefox Add-on: ![Firefox Add-on link](https://addons.mozilla.org/en-US/firefox/addon/chromafy/)
Website (docs included): ![Website link](https://chromafy.vercel.app/)

## Tech Stack

<div align="left">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width=40 height=40 alt="reactjs logo"/>
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/chrome/chrome-original.svg" width=40 height=40 alt="chrome logo" />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firefox/firefox-plain.svg" width=40 height=40 alt="firefox logo"/>  
<img src="https://github.com/PrajwalDhule/Chromafy/assets/89639472/51099b09-50e0-4ffa-93ba-916758f48c46" width=40 height=40 alt="astro logo"/>
</div>

## Installation

i. Fork the repo into your account

ii. Clone the project into your local machine

```sh
git clone https://github.com/<Your-name>/Chromafy.git
```

_Chromafy Extension_

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

_NOTE: the CSS files are located in the chromafy-extension/extension-files/styles folder_

_If you've made any changes_

4. Build the react app

```sh
npm run build
```

5. Navigate back by one directory, and then navigate to extension-files folder

```sh
cd ..
cd extension-files
```

6. Get the name of the newly built contentScript file from the assets folder inside the build (dist) folder (i.e. full path: chromafy-extension/extension-files/dist/assets/)

![contentScript build file](https://github.com/PrajwalDhule/Chromafy/assets/89639472/475bcf5f-d181-415d-8810-060ff154ac75)

7. Update the previous contentScript file name with the current one in injectReactApp function inside contentScript.js (i.e. full path: chromafy-extension/extension-files/contentScript.js)

![contentScript file name update](https://github.com/PrajwalDhule/Chromafy/assets/89639472/907c17aa-4ede-44f0-9daf-4cd9432cf729)

**To upload the web extension and use it on your device**

8. go to `chrome://extensions/` in your Chrome browser, click `load unpacked` and select the `extension-files` folder (i.e full path: chromafy-extension/extension-files)

![upload_to_chrome](https://github.com/PrajwalDhule/Chromafy/assets/89639472/6b77c769-ccc0-419c-844b-27ffb92ee4f1)

_Chromafy Website_

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

## Contributing Guidelines

Thank you for considering to contribute to this project 😄

### What do I need to know to contribute?

Anybody who is familiar with the project's tech stack of **ReactJS**/**Astro**/**Chrome Extensions**/**Firefox Extensions** can contribute.
If you are interested to contribute and want to learn more about the technologies that are used in this project, checkout the links below.

- [ReactJs Official Docs](https://react.dev/reference/react)
- [Astro Official Docs](https://docs.astro.build/en/getting-started/)
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/get-started)

### How to make a Contribution?

Never made an open source contribution before? And wondering how to contribute to this project?
No worries! Here's a quick guide,

1. Choose any feature/bug you wanna contribute to.
2. Fork the repository into your own account.
3. Clone the repo you have forked in your local machine using `git clone https://github.com/<Your-name>/Chromafy.git`
4. Create a new branch for your fix by using the command `git checkout -b YourName-branch-name `
5. Make the changes you wanna do and stage them using the command `git add files-you-have-changed ` or use `git add .`
6. Use the `git commit -m "Short description of the changes"` to describe the changes you have done with a message.
7. Push the changes to your remote repository using `git push origin your-branch-name`
8. Submit a PR(pull request) to the upstream repository (PrajwalDhule/Chromafy) with a title and a small description.
9. Wait for the pull request to be reviewed, make appropriate changes if recommended, and submit it.
10. And your pull request is merged! Congrats 🎊

Checkout the [Contributing.md](CONTRIBUTING.md) file before contributing.

### Where can I go for help, or just contact?

If you need help, you can email at:

- <a href="mailto:chromafy.contact@gmail.com" target="_blank" rel="noopener noreferrer">**chromafy.contact@gmail.com**</a>

Or connect with me on

- <a href="https://twitter.com/prajwaldhule36" target="_blank" rel="noopener noreferrer">**Twitter**</a>
- <a href="https://www.linkedin.com/in/prajwal-dhule" target="_blank" rel="noopener noreferrer">**Linkedin**</a>

## License

[CC BY-NC-ND](LICENSE.md)
