# Liquidity Pool Directory of Providers

## About this project
### Manifest

## Adding a provider to the directory
- Fork this repository
- Copy the template file `template.json`
- Paste and rename file in `/pools/` folder to match pool unique short name without spaces, alphanumeric, all common.
- Change the fields in the file denoted by `### Data ###`
- Follow the steps below to test your changes locally and ensure data is displayed correctly
- Commit changes to your working branch, push to your fork and create a pull request on GitHub.

## Testing locally
### Basic requirements
- Python
- Latest stable Node.js

### To Run
- Clone repository
- Enter repository folder ```cd de-link```
- Install dependencies ```npm install```
- Build dist ```node ./build.js```
- Start local web-server ```http-server ./dist -p 8080```
- The site is now available at http://127.0.0.1:8080