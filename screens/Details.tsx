import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import * as dayjs from 'dayjs';
import Airtable from 'airtable';
import { LogBox } from 'react-native'
import { format, formatDistance, formatRelative, subDays } from 'date-fns'
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
const Item = ({ name }) => (
    <View style={styles.item}>
        <Text style={styles.title}>{name}</Text>
    </View>
);
export const DetailsScreen: FC<DetailsScreenProps> = ({ route, navigation }) => {
    LogBox.ignoreAllLogs(true);
    const { name } = route.params;
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    var differenceInDays = require('date-fns/differenceInDays')
    var startOfToday = require('date-fns/startOfToday')
    function compareNumbers(a, b) {
        return a - b
     }
    // Note: the empty deps array [] means
    // this useEffect will run once
    // similar to componentDidMount()
    // useEffect(() => {
        var Airtable = require('airtable');
        var base = new Airtable({ apiKey: 'keywAgs0R5LO4CpjY' }).base('appFD2g0OEjhkrviY');
        // base('Piotrowice').select({
        //     // Selecting the first 3 records in Grid view:

        //     view: "Grid view"
        // })

        // .eachPage(function page(records: Array<any>, fetchNextPage) {
        //     
            // fetchNextPage()
            base('Piotrowice').select({
                view: 'Grid view'
            }).firstPage(function(err, records) {
                if (err) { console.error(err); return; }
            var rzecz = records.map(record => { return record.fields });
            var wywoz_mieszane = rzecz.map(item => item.mieszane.split(','));
            var wywoz_segregowane = rzecz.map(item => item.segregowane.split(','));
            for (var i = 0; i < rzecz.length; i++) {
                var arr_mieszane = wywoz_mieszane[i]
                var arr_m = [];
                for (var o = 0; o < wywoz_mieszane[o].length; o++) {
                    if(rzecz[i].name == name){
                    // var date1 = dayjs(arr_mieszane[o])
                    // var roznica = date1.diff(dayjs(), 'days');
                    var today = startOfToday();
                    var date1 = new Date(arr_mieszane[o]);
                    var roznica =  differenceInDays(
                        date1,
                        today)
                    if(roznica>0){
                        arr_m.push(roznica);
                    }
                    }
                    arr_m.sort(compareNumbers);
                }
                rzecz[i]["mieszane"] = arr_m.join([',']);
                var arr_segregowane = wywoz_segregowane[i]
                var arr_s = [];
                for (var o = 0; o < wywoz_segregowane[o].length; o++) {
                    if(rzecz[i].name == name){
                    // var date1 = dayjs(arr_segregowane[o])
                    // var roznica = date1.diff(dayjs(), 'days');
                    var date1 = new Date(arr_segregowane[o]);
                    var today = startOfToday();
                    var roznica =  differenceInDays(
                        date1,
                        today)
                    if(roznica>0){
                        arr_s.push(roznica);
                    }
                    }
                    arr_s.sort(compareNumbers);
                }
                rzecz[i]["segregowane"] = arr_s.join([',']);
            }
            setItems(rzecz);
            records.forEach(function (record) {
                var ajdi = record.id
                base('Piotrowice').find(ajdi, function (err, record) {
                    if (err) { return; }
                    setIsLoaded(true);
                });
            });
            });

    //     },
    //         function done(err) {
    //             if (err) { return; }
    //             setIsLoaded(true);
    //         });
    // }, [])
    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <Text>DZIAŁAJ</Text>;
    } else {
        return (
            <View style={styles.container}>
                <Text>{'Ulica: ' + name + ' najbliższy wywóz śmieci segregowanych za: ' + items.find(x => x.name === name).segregowane.split(',').[0] + ' dni, a śmieci mieszanych za: ' + items.find(x => x.name === name).mieszane.split(',').[0] +' dni.'}</Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
      },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
});
