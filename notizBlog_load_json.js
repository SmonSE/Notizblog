//    Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: magic;
// notizblog Artikel Update

let param = args.widgetParameter

const apiData = await getNewCasesData()
const date = await getDate()

const widgetSize = (config.widgetFamily ? 
// config.widgetFamily : 'small');
config.widgetFamily : 'large')
// config.widgetFamily : '');
const widget = await createWidget();

// For debug delete "!" from !config.runInWidget
if (!config.runInWidget) {
 switch(widgetSize) {
   case 'small':
   await widget.presentSmall();
   break;

   case 'large':
   await widget.presentLarge();
   break;

   default: // medium
   await widget.presentMedium();
 }
}
Script.setWidget(widget);
Script.complete();

//------------------------------------------------
// build the content of the widget
async function createWidget() {

 const list = new ListWidget();

 let row1 = list.addStack()
 row1.layoutHorizontally()
 row1.addSpacer(1)

 let column1 = row1.addStack()
 column1.layoutVertically()

 let column2 = row1.addStack()
 column2.layoutVertically()

 const logoImg = await getImage('logo.png')
 const logoStack = column2.addStack()

 if (widgetSize != 'small') {
   logoStack.addSpacer(130)
   list.setPadding(15, 25, 5, 25)
 }
 else {
   logoStack.addSpacer(10)
   list.setPadding(5, 5, 5, 5)
 }

 const logoImageStack = logoStack.addStack()
 logoStack.layoutHorizontally()
 logoImageStack.backgroundColor = new Color("#ffffff", 1.0)
 logoImageStack.cornerRadius = 6
 const wimg = logoImageStack.addImage(logoImg)

  if (widgetSize != 'small') {
   wimg.imageSize = new Size(50, 50)
   wimg.rightAlignImage()
 }else {
   wimg.imageSize = new Size(40, 40)
   wimg.rightAlignImage()
 }


 const paperText = column1.addText("notiz.Blog")
 if (widgetSize != 'small') {
   paperText.font = Font.mediumRoundedSystemFont(20)
 }else {
   paperText.font = Font.mediumRoundedSystemFont(18)
}

 // Last Artikel Title
 const lastArtikel = list.addText(apiData.items[0].title)
if (widgetSize != 'small') {
   lastArtikel.font = Font.mediumRoundedSystemFont(18)
 }else {
   lastArtikel.font = Font.mediumRoundedSystemFont(16)
 }

 lastArtikel.textColor = new Color("#00CD66")

 // string has max length for date 
 let apiDatePub = apiData.items[0].date_published
 var strDate = apiDatePub.substr(0, 10)

if (widgetSize != 'small') {
   console.log("Bride size get txt!")

   // Last Artikel published date
   const lastArtDate = column1.addText(strDate)
   lastArtDate.font = Font.mediumRoundedSystemFont(15)

   const row2 = list.addStack()  
   row2.layoutVertically()

   if (date == apiDatePub) {
     const street = list.addText("New Artikel")
     street.font = Font.regularSystemFont(14)
     street.textColor = new Color("#00CD66")
   }else{
     const newArt = list.addText(apiData.items[0].content_text)  
     newArt.font = Font.regularSystemFont(10)
   }
 }else {
  console.log("Small size no txt!")
  const showDate = list.addText("Published at: " + " " + strDate)
  showDate.font = Font.mediumRoundedSystemFont(12)

  list.addSpacer(4)

  const publisher = list.addText("Author: " + apiData.items[0].author.name)
  publisher.font = Font.mediumRoundedSystemFont(10)
 }

 return list
}

//------------------------------------------------
// url get json https://notiz.blog/feed/json
async function getNewCasesData() {

 let url = "https://notiz.blog/feed/json"
 let req = new Request(url)
 let apiResult = await req.loadJSON()

 return apiResult
}

//------------------------------------------------
// get date to compare with articel date
async function getDate() {

 let currentTime = new Date().toLocaleTimeString('de-DE', { hour: "numeric", minute: "numeric" })
 let currentDay = new Date().getDate();
 let currentMonth = new Date().getUTCMonth()+1;
 let currentYear = new Date().getFullYear();

 let date = (currentYear + "-" + currentMonth + "-" + currentDay); 

 return date
}

//------------------------------------------------
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

//------------------------------------------------
// helper function to download an image from a given url
async function loadImage(imgUrl) {
  const req = new Request(imgUrl)
  return await req.loadImage()
}

//------------------------------------------------
// For Checking Frame Size
async function presentAlert(prompt,items,asSheet) 
{
 let alert = new Alert()
 alert.message = prompt

 for (const item of items) {
   alert.addAction(item)
 }
 let resp = asSheet ? 
   await alert.presentSheet() : 
   await alert.presentAlert()
 return resp
}

// end of script copy until here
