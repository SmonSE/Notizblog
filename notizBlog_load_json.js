// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: magic;
// notizblog Artikel Update

let param = args.widgetParameter
if (param != null && param.length > 0) {
    storeId = param
}

const widget = new ListWidget()
const apiData = await getNewCasesData()
const date = await getDate()
await createWidget()


// used for debugging if script runs inside the app
if (!config.runsInWidget) {
    await widget.presentSmall()
}
Script.setWidget(widget)
Script.complete()

// build the content of the widget
async function createWidget() {

  widget.addSpacer(4)
  const logoImg = await getImage('logo.png')

  widget.setPadding(10, 10, 10, 10)
  const titleFontSize = 12
  const detailFontSize = 36

  const logoStack = widget.addStack()
  logoStack.addSpacer(80)
  const logoImageStack = logoStack.addStack()
  logoStack.layoutHorizontally()
  logoImageStack.backgroundColor = new Color("#ffffff", 1.0)
  logoImageStack.cornerRadius = 6
  const wimg = logoImageStack.addImage(logoImg)
  wimg.imageSize = new Size(50, 50)
  wimg.rightAlignImage()
  widget.addSpacer()

  let row = widget.addStack()
  row.layoutHorizontally()
  row.addSpacer(1)

  let column = row.addStack()
  column.layoutVertically()

  const paperText = column.addText("notiz.Blog")
  paperText.font = Font.mediumRoundedSystemFont(20)
    
  // Last Artikel Title
  const lastArtikel = column.addText(apiData.items[0].title)
  lastArtikel.font = Font.mediumRoundedSystemFont(14)
  lastArtikel.textColor = new Color("#00CD66")
  widget.addSpacer(2)

  // string has max length for date 
  let apiDatePub = apiData.items[0].date_published
  var strDate = apiDatePub.substr(0, 10);
  console.log(date) 
  console.log(apiDatePub) 
  
  // Last Artikel published date
  const lastArtDate = column.addText(strDate)
  lastArtDate.font = Font.mediumRoundedSystemFont(10)
  
  if (date == apiDatePub) {
    // row two
    const row2 = widget.addStack()
    row2.layoutVertically()

    const street = row2.addText("New Artikel")
    street.font = Font.regularSystemFont(14)
    street.textColor = new Color("#00CD66")
  }
}


// url get json https://notiz.blog/feed/json
async function getNewCasesData() {
  
  let url = "https://notiz.blog/feed/json"
  let req = new Request(url)
  let apiResult = await req.loadJSON()
  
  return apiResult
}

// create date 
async function getDate() {

  let currentTime = new Date().toLocaleTimeString('de-DE', { hour: "numeric", minute: "numeric" })
  let currentDay = new Date().getDate();
  let currentMonth = new Date().getUTCMonth()+1;
  let currentYear = new Date().getFullYear();  
  let date = (currentYear + "-" + currentMonth + "-" + currentDay); 
  
//     console.log("Date: " + date)
  
    return date
}


// get images from local filestore or download them once
async function getImage(image) {
   let fm = FileManager.local()
   let dir = fm.documentsDirectory()
   let path = fm.joinPath(dir, image)
   if (fm.fileExists(path)) {
       return fm.readImage(path)
    } else {
        // download once
        let imageUrl
        switch (image) {
            case 'logo.png':
                imageUrl = "https://notiz.blog/wp-content/uploads/2019/10/cropped-notizblog-icon-1-180x180.png"
                break
            default:
                console.log(`Sorry, couldn't find ${image}.`);
        }
        let iconImage = await loadImage(imageUrl)
        fm.writeImage(path, iconImage)
        return iconImage
    }
}


// helper function to download an image from a given url
async function loadImage(imgUrl) {
   const req = new Request(imgUrl)
   return await req.loadImage()
}


// end of script copy until here
