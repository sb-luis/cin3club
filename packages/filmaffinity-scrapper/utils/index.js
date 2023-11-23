import fs from 'fs';

export const readJsonFile = (path) => {
  console.log(`Reading JSON file at: ${path}`);
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (error, data) => {
      if (error) {
        return console.log(error);
      } else {
        const parsedData = JSON.parse(data);
        console.log('JSON file parsed correctly!');
        resolve(parsedData);
      }
    });
  });
};

export const writeJsonFile = async (data, filePath) => {
  console.log(`Writting JSON file at: ${filePath}`);
  // Convert JSON data to a string
  const jsonString = JSON.stringify(data, null, 2); // The third parameter (2) is for indentation

  // Write to the JSON file
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, jsonString, (err) => {
      if (err) {
        reject();
        console.error('Error writing to JSON file:', err);
      } else {
        resolve();
      }
    });
  });
};

export const pause = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};
