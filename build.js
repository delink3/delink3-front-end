// console.log('Hello world')

function listFiles(parent) {
  const fs = require('fs')
  let dir = parent ? parent : '/';
  return fs.readdirSync(dir)
}

function read(file, parse) {
  const fs = require('fs')
  if(parse){return JSON.parse(fs.readFileSync(file, 'utf8'))}
  return fs.readFileSync(file, 'utf8');
}

function reCreateFolders(folder) {
  const fs = require('fs')
  folder = folder ? folder : '/dist'
  if (fs.existsSync(folder)) { fs.rmdirSync(folder, { recursive: true }) }
  fs.mkdirSync(folder)
}

function parseStr(string, test) {
  string = String(string)
  if (string.length <= 0) { return test ? false : '' }
  if (string.indexOf("###") >= 0) { return test ? false : '' }
  return string
}

function makePage(provider, content) {
  //FUNCTION TO MAKE PAGES FOR PROJECTS WITH ADDITIONAL DATA ETC.
}

function cleanupGH(link) {
  link = link.substring(link.length-1,link.length) === "/"?link.substring(0,link.length-1):link
  link=link.replace("https://", "").replace("http://", "").replace("github.com", "").replace(/\//g, `<span class="slash">/</span>`)
  return link
}

function makeFrontpage() {
  const fs = require('fs')
  let dist = ''
  dist += fs.readFileSync('./components/head.ejs')
  dist += fs.readFileSync('./components/nav.ejs')
  
  let homepageWrapper = ''
  homepageWrapper += fs.readFileSync('./components/hero.ejs')

  let body = fs.readFileSync('./components/homepage.ejs')
  let contents = ''
  let providers = listFiles('./pools/')
  let tbody = ''
  for (const provider of providers) {
    if (provider.indexOf('.json') >= 0) {
      let content = read('./pools/' + provider, true)
      let operators = `<a href="${content.url}" target="_blank" class="link operator-link operator-main">${cleanupGH(String(content.url))}</a>`
      let additionalOperators = ``
      for (const op of content.additionalURLs) {
        if (parseStr(op, true)) { additionalOperators += `<a href="${op}" target="_blank" class="link operator-link operator-additional">${cleanupGH(String(op))} <i class="icon-external-link"></i></a>` }
      }
      if (additionalOperators.length > 0) { operators += `<div data="+${content.additionalURLs.length} links" class="more-links unclicked">${additionalOperators}</div>` }
      tbody += `
        <tr>
          <td>${content.projectName}</td>
          <td><i class="icon-link compact"></i><a href="${content.officialLink}" target="_blank" class="link operator-link operator-main">${cleanupGH(String(content.officialLink))}</a></td>
          <td><i class="icon-server compact"></i><div class="operator-flex">${operators}</div></td>
          <td><i class="icon-git-merge compact"></i><a href="${content.repo}" target="_blank" class="link repo-link">${cleanupGH(String(content.repo))}</a></td>
          <td>${parseStr(content.operatorInfo).length > 0?'<i class="icon-info compact"></i>': ''
    } ${parseStr(content.operatorInfo)}</td>
        </tr>`
      contents += content
    }
  }
  let table = `
      <table>
        <thead>
          <tr>
            <td>Project</td>
            <td><i class="icon-link"></i> Official Link</td>
            <td><i class="icon-server"></i> Operators</td>
            <td><i class="icon-git-merge"></i> GitHub</td>
            <td><i class="icon-info"></i> Operator Info</td>
          </tr>
          </thead>
        <tbody>${tbody}</tbody>
      </table>`
  body = String(body).replace('$contents', table)
  homepageWrapper += body
  let recommended = read('./recommended-providers/data.json', true)
  let recommendedUI = ''
  for (const [key, value] of Object.entries(recommended)) {
    let img = value.logo?`<img src="${value.logo}"/>`:''
    recommendedUI+=`<a title="${value.details}" href="${value.url}" target="_blank">${img}${key}</a>`
  }
  homepageWrapper += `<div class="recommendations" data-title="Recommended decentralized service providers">${recommendedUI}</div>`
  dist += `<div>${homepageWrapper}</div>`
  dist += fs.readFileSync('./components/foot.ejs')
  dist += fs.readFileSync('./components/scripts.ejs')

  fs.writeFileSync('./dist/index.html', dist);

}

function consolidateAssets() {
  const fs = require('fs')
  const fse = require('fs-extra');

  const directories = ['./src/css/', './src/js/']
  for (const dir of directories) {
    let data = ''
    let asset = listFiles(dir)
    let ext = '.' + dir.replace('./src/', '').replace(/\//g, '')
    for (const ass of asset) {
      if (ass.indexOf(ext) >= ass.length - ext.length) {
        data += read(dir + ass) + " "
      }
      else if (ass.indexOf(ext + '.map') >= 0) {
        fs.writeFileSync(dir.replace("./", "./dist/") + ass, read(dir + ass));
      }
    }
    let newFile = dir.replace("./", "./dist/") + "file" + ext
    fs.writeFileSync(newFile, data);
  }


  const assetFolders = ['./src/img/', './src/fonts/']
  for (const dir of assetFolders) {
    let destDir = dir.replace('./src/', './dist/src/')
    fse.copySync(dir, destDir)
  }
}


//PERFORMING BUILD
const mainFolders = ["./dist", "./dist/src", "./dist/src/css", "./dist/src/fonts", "./dist/src/img", "./dist/src/js"]
for (const folder of mainFolders) { reCreateFolders(folder) }
consolidateAssets()
makeFrontpage()



