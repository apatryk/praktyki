import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import * as dayjs from 'dayjs';
import { ActivityIndicator, Colors } from 'react-native-paper';
import { View, Text} from 'react-native-ui-lib';
import { Col, Grid } from 'react-native-easy-grid';
var parse = require('date-fns/parse')
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
export const DetailsScreen: FC<DetailsScreenProps> = ({ route, navigation }) => {
    const { name } = route.params;
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    var differenceInDays = require('date-fns/differenceInDays')
    var startOfToday = require('date-fns/startOfToday')
    function compareNumbers(a, b) {
        return a - b
    }
    useEffect(() => {
        fetch("https://api.airtable.com/v0/appFD2g0OEjhkrviY/Piotrowice?api_key=keywAgs0R5LO4CpjY")
            .then(res => res.json())
            .then(
                (result) => {
                    var rzecz = result.records.map(record => { return record.fields });
                    var wywoz_mieszane = rzecz.map(item => item.mieszane.split(','));
                    var wywoz_segregowane = rzecz.map(item => item.segregowane.split(','));
                    for (var i = 0; i < rzecz.length; i++) {
                        var arr_mieszane = wywoz_mieszane[i]
                        var arr_m = [];
                        for (var o = 0; o < wywoz_mieszane[o].length; o++) {
                            if (rzecz[i].name == name) {
                                var today = startOfToday();
                                var date1 = parse(
                                    arr_mieszane[o],
                                    'MM/dd/yyyy',
                                    new Date()
                                )
                                var roznica = differenceInDays(
                                    date1,
                                    today)
                                if (roznica > 0) {
                                    arr_m.push(roznica);
                                }
                            }
                            arr_m.sort(compareNumbers);
                        }
                        rzecz[i]["mieszane"] = arr_m.join([',']);
                        var arr_segregowane = wywoz_segregowane[i]
                        var arr_s = [];
                        for (var o = 0; o < wywoz_segregowane[o].length; o++) {
                            if (rzecz[i].name == name) {
                                var date1 = parse(
                                    arr_segregowane[o],
                                    'MM/dd/yyyy',
                                    new Date()
                                )
                                var today = startOfToday();
                                var roznica = differenceInDays(
                                    date1,
                                    today)
                                if (roznica > 0) {
                                    arr_s.push(roznica);
                                }
                            }
                            arr_s.sort(compareNumbers);
                        }
                        rzecz[i]["segregowane"] = arr_s.join([',']);
                    }

                    setItems(rzecz)
                    setIsLoaded(true);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )


    }, [])
    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <View flex-1><Grid style={styles.gridzik}><ActivityIndicator animating={true} color={Colors.red800} /></Grid></View>;
    } else {
        return (
            <View flex-1>
                <Grid style={styles.gridzik}>
                    <Col style={styles.kafelek}><Text style={styles.text}>Śmieci segregowane</Text><Text style={styles.text}>{items.find(x => x.name === name).segregowane.split(',').[0]+ ' dni'}</Text></Col>
                    <Col style={styles.kafelek}><Text style={styles.text}>Śmieci mieszane</Text><Text style={styles.text}>{items.find(x => x.name === name).mieszane.split(',').[0]+ ' dni'}</Text></Col>
                </Grid>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    text: {
        color: "#000000",
        fontWeight:"bold",
        fontSize:18
    },
    kafelek: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
    },
    gridzik: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});