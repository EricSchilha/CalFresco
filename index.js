const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Calendar API.
  authorize(JSON.parse(content), listEvents);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

 //Global Variables
 var today = new Date();
 today.setDate(today.getDate());
 var endweek = new Date();
 endweek.setDate(today.getDate() + 7);
 var events = [];
 var timeSlots = [];

function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  calendar.events.list({
    calendarId: 'primary',
    timeMin: today.toISOString(),
    timeMax: endweek.toISOString(),
    maxResults: 150,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    events = res.data.items;
    console.log(events);
    if (events.length) {
      console.log('Upcoming ${events.length} events:');
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
      });
    } else {
      console.log('No upcoming events found.');
    }
  });
}

var eventResults = [
    {name: "Arts Midterm De-Stress",
    start: new Date("June 23, 2019 12:00:00"),
    end: new Date("June 23, 2019 15:00:00")},
    {name: "Coping Seminar - Thriving With Emotions",
    start: new Date("June 24, 2019 15:00:00"),
    end: new Date("June 24, 2019 16:00:00")},
    {name: "Wellness Collaborative Launch",
    start: new Date("June 25, 2019 8:30:00"),
    end: new Date("June 25, 2019 12:30:00")},
    {name: "Luncheon with Profs",
    start: new Date("June 26, 2019 11:00:00"),
    end: new Date("June 26, 2019 13:00:00")},
    {name: "Coping Seminar - Cultivating With Resilience",
    start: new Date("June 26, 2019 16:00:00"),
    end: new Date("June 26, 2019 17:00:00")},
    {name: "Casino Night",
    start: new Date("June 27, 2019 18:00:00"),
    end: new Date("June 27, 2019 20:30:00")}
]

function generateTimeSlots(){
  var openStart = today.setHours(9,0,0); //9am is the first time you have an opening to check
  var eventStart; //this is the starting time of the event
  var eventEnd; //this is the ending time of the event
  var timeBlock; //object that holds startTime, endTime, and Name

  events.map((event, i) => {
    eventStart = event.start.dateTime;
    eventEnd = event.end.dateTime;
    
    timeBlock = {
        start:openStart.getDate(),
        end:eventStart.getDate(),
    }

    if (eventStart.getDate() > openStart.getDate()){
       timeSlots.push(timeBlock);
       openStart = eventEnd.getDate();
    }
  });
}

function eventGenerator(){
    const numBlocks = timeSlots.length();
    var newEvents; //creates the new event list to be sent
    var event; //object to be pushed to newEvents
    var numResults = eventResults.length();
    var slotStart = new Date();
    var slotEnd = new Date();
    var eventStart = new Date();
    var eventEnd = new Date();

    for (var i; i < numBlocks; i++){
        slotStart = timeSlot[i].start.getDate();
        slotEnd = timeSlot[i].end.getDate();
      for (var j; j < numResults; j++){
            eventStart = eventResults[j].start.getDate();
            eventEnd = eventResults[j].end.getDate(); 
          if (eventStart >= slotStart && eventEnd <= slotEnd){
              newEvents.push(eventResults[j]);
              break;
          }
      }
    }
}

/** 
//compareTimes: compares time1 and time2 and returns true if the second time 
//  is greater than the first time, false otherwise.
function compareTimes(time1, time2){
    var time1mins = timeToMinutes(time1);
    var time2mins = timeToMinutes(time2);

    return time1mins < time2mins;
}

//timeToMinutes(str): converts the string time given by an
//  event into a int for comparisons.
function timeToMinutes(str){
  var minutes;
  var startOfStr = str.indexOf("T");
  var midOfStr = str.indexOf(":");
  minutes = parseInt(str.substring(startOfStr + 1, midOfStr - 1)) * 60;
  minutes += parseInt(str.substr(midOfStr + 1,2));
 return minutes;
}

//timeScrapper(str): returns a string in the form of
//  THH:MM from the large string given from the event data.
function timeScrapper(str){
    var block;
    var startOfStr = str.indexOf("T");
    block = "T" + str.substr(startofStr, 6)
   return block;
}
*/