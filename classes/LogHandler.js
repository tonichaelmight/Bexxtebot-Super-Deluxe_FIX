import { appendFileSync, writeFileSync, existsSync, mkdirSync, readFileSync, readdirSync } from 'fs';

// class Timestamp {
//   constructor(year, month, day, hour, minute, second) {

//   }
// }

// class LogEntry {
//   constructor(year, month, day, hour, minute, second, data) {
//     this.year = year;
//     this.month = month;
//     this.day = day;
//     this.hour = hour;
//     this.minute = minute;
//     this.second = second;
//     this.data = data;
//   }
// }

export default class LogHandler {
  constructor() {
    this.rootDirectory = './logs'
  }

  getCurrentTimestamp() {
    const timestamp = new Date(Date.now())
    .toLocaleString('en-US', { 
      timeZone: 'America/New_York', 
      hourCycle: 'h23'
    });
    return timestamp;
  }

  getTimestampMapping(timestamp) {
    const [date, time] = timestamp.split(', ');
    const [month, day, year] = date.split('/');
    const [hour, minute, second] = time.split(':');
    const map = {year, month, day, hour, minute, second};
    return map;
  }

  buildFileStructureFromTimestampMap(timestampMap, section) {
    const { year, month, day, hour, minute, second } = timestampMap;
    const path = `${this.rootDirectory}/${section}/${year}/${month}/${day}/${hour}/${minute}/${second}/`;
    mkdirSync(path, {recursive:true})
    return path;
  }

  getTimestampFromURL(url) {
    const dateFromURL = url.replace(/\.\/logs\/(error|command)\//, '');
    const [ year, month, day, hour, minute, second ] = dateFromURL.split('/');
    const timestamp = new Date(year, month-1, day, hour, minute, second).toLocaleString('en-US', { 
      timeZone: 'America/New_York', 
      hourCycle: 'h23'
    });
    return timestamp;
  }

  truncatePath(path) {
    path = path.split('/');
    path.pop();
    path = path.join('/');
    return path;
  }

  makeLog(type) {
    let path = `./logs/${type}`;
    const outputFile = `./logs/${type}s.txt`
    writeFileSync(outputFile, '');

    readdirSync(path).reverse().forEach(year => {
      const yearDir = `/${year}`;
      path += yearDir;
      readdirSync(path).reverse().forEach(month => {
        const monthDir = `/${month}`;
        path += monthDir;
        readdirSync(path).reverse().forEach(day => {
          const dayDir = `/${day}`;
          path += dayDir;
          readdirSync(path).reverse().forEach(hour => {
            const hourDir = `/${hour}`;
            path += hourDir;
            readdirSync(path).reverse().forEach(minute => {
              const minuteDir = `/${minute}`;
              path += minuteDir;
              readdirSync(path).reverse().forEach(second => {
                const secondDir = `/${second}`;
                path += secondDir;
                const timestamp = this.getTimestampFromURL(path);
                path += '/data.json';
                const dataJSON = readFileSync(path, 'utf-8');
                // do stuff with the data
                const data = JSON.parse(dataJSON);

                data.forEach(entry => {
                  appendFileSync(outputFile, timestamp + '\n');
                  appendFileSync(outputFile, `Context: ${entry.context}\n`);
                  appendFileSync(outputFile, `Username: ${entry.username}\n`);
                  appendFileSync(outputFile, `Message Content: ${entry.messageContent}\n`);
                  appendFileSync(outputFile, '\n---------------------------------------\n\n');
                })


                // remove sections as they are consumed
                // think about a better way to achieve this
                path = path.replace('\/data.json', '');
                path = this.truncatePath(path);
              })
              path = this.truncatePath(path);
            })
            path = this.truncatePath(path);
          })
          path = this.truncatePath(path);
        })
        path = this.truncatePath(path);
      })
      path = this.truncatePath(path);
    })

  }

  log(type, context, messageObject) {
    const timestamp = this.getCurrentTimestamp();
    const timestampMap = this.getTimestampMapping(timestamp);

    const path = this.buildFileStructureFromTimestampMap(timestampMap, type);

    const eventData = {
      context: context.stack || context,
      username: messageObject.tags.username,
      messageContent: messageObject?.content
    }
    
    const fileName = `${path}data.json`;
    let fileData = [];
    if (existsSync(fileName)) {
      const fileTextJSON = readFileSync(fileName, 'utf-8');
      fileData = JSON.parse(fileTextJSON);
    }
    const allData = [...fileData, eventData];
    const allDataJSON = JSON.stringify(allData);
    writeFileSync(fileName, allDataJSON);
  }

}