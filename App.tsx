import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const App = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  var arr = [];
  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
  var Airtable = require('airtable');
  var base = new Airtable({apiKey: '---------------'}).base('appFD2g0OEjhkrviY');
  base('Table 1').select({
    // Selecting the first 3 records in Grid view:
    
    view: "Grid view"
  }).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    records.forEach(function(record) {
        var ajdi = record.id
        base('Table 1').find(ajdi, function(err, record) {
          if (err) { console.error(err); return; }
          for(var i = 1; i< Object.keys(record.fields).length; i++){
          var d1 = new Date(record.get("Date" + i));
          var d2 = new Date();
          var roznica = d1.getTime() - d2.getTime();
          var days = Math.ceil(roznica / (1000 * 3600 * 24));
          if(Math.sign(days) == 1){
            var ulica = record.get("Name");
            var key = ulica;
            var obj = {};
            obj[key] = days;
            arr.push(obj);
            console.log('wywóz', ulica, days, arr);
          }
        }
        });
    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage()
    
},
  function done(err) {
    if (err) { console.error(err); return; }
    setIsLoaded(true);
    setItems(arr);
  });
}, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <Text>{items}</Text>
    );
  }
}
export default App;