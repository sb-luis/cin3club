/*
import csv from 'csv-parser';

const readCsvFile = (filePath) => {
  console.log('Reading CSV file...');
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        console.log('CSV file parsed correctly!');
        resolve(results);
      });
  });
};

const mapRawRatingsToSchema = (data) => {
  return data.map((item, index) => {
    try {
      const date = new Date(item['Last Seen']);
      const dateSeen = date.toISOString().split('T')[0];

      return {
        title: item.Title,
        score: item.Rating * 10,
        year: item.Year,
        director: item.Director,
        country: item.Country,
        dateSeen,
      };
    } catch (err) {
      console.log(`Failed at index ${index}`);
    }
  });
};
*/
