import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ActivityIndicator, Colors } from 'react-native-paper';
import { View, Text } from 'react-native-ui-lib';
import { Col, Grid } from 'react-native-easy-grid';
import parse from 'date-fns/parse';
import differenceInDays from 'date-fns/differenceInDays';
import startOfToday from 'date-fns/startOfToday';
import { apiUrl } from '../Api';
export const DetailsScreen: FC<DetailsScreenProps> = ({ route, navigation }) => {
    const { name } = route.params;
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    function dateDiff(a, b) {
        var dateParse = parse(
            a,
            'MM/dd/yyyy',
            new Date());
        var dateDifference = differenceInDays(
            dateParse,
            startOfToday());
        if (dateDifference > 0) {
            b.push(dateDifference);
        }
    };
    function sortDateArray(a) {
        a.sort(
            function (a, b) {
                return a - b
            }
        );
    };
    useEffect(() => {
        fetch(apiUrl.URL)
            .then(res => res.json())
            .then(
                (result) => {
                    const airtableResult = result.records.map(record => { return record.fields });
                    const mixed_rubbish = airtableResult.map(item => item.mixed.split(','));
                    const segregated_rubbish = airtableResult.map(item => item.segregated.split(','));
                    airtableResult.map(function (item, resultLength) {
                        const arr_mixed = mixed_rubbish[resultLength]
                        let arr_m = [];
                        mixed_rubbish.map(function (item, categoryLength) {
                            if (airtableResult[resultLength].name == name) {
                                dateDiff(arr_mixed[categoryLength], arr_m);
                            }
                            sortDateArray(arr_m);
                        });
                        airtableResult[resultLength]["mixed"] = arr_m.join([',']);
                        const arr_segregated = segregated_rubbish[resultLength]
                        let arr_s = [];
                        segregated_rubbish.map(function (item, categoryLength) {
                            if (airtableResult[resultLength].name == name) {
                                dateDiff(arr_segregated[categoryLength], arr_s);
                            }
                            sortDateArray(arr_s);
                        });
                        airtableResult[resultLength]["segregated"] = arr_s.join([',']);
                    });
                    setItems(airtableResult)
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
        return <View flex-1><Grid style={styles.grid}><ActivityIndicator animating={true} color={Colors.red800} /></Grid></View>;
    } else {
        return (
            <View flex-1>
                <Grid style={styles.grid}>
                    <Col style={styles.gridElement}>
                        <Text style={styles.text}>Śmieci segregowane</Text>
                        <Text style={styles.text}>{items.find(x => x.name === name).segregated.split(',').[0] + ' dni'}</Text>
                    </Col>
                    <Col style={styles.gridElement}>
                        <Text style={styles.text}>Śmieci mieszane</Text>
                        <Text style={styles.text}>{items.find(x => x.name === name).mixed.split(',').[0] + ' dni'}</Text>
                    </Col>
                </Grid>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    text: {
        color: "#000000",
        fontWeight: "bold",
        fontSize: 18
    },
    gridElement: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
    },
    grid: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
