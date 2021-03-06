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
        a.map(function(item){
            const dateParse = parse(
                item,
                'MM/dd/yyyy',
                new Date());
            const dateDifference = differenceInDays(
                dateParse,
                startOfToday());
            if (dateDifference > 0) {
                b.push(dateDifference);
            }
        })
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
                    const resultForName = airtableResult.filter(result => result.name === name)
                    const mixedResult = resultForName[0].mixed.split(',');
                    const segregatedResult = resultForName[0].segregated.split(',');
                    let [arrS, arrM] = [[],[]];
                    dateDiff(mixedResult, arrM)
                    sortDateArray(arrM);
                    resultForName[0].["mixed"] = arrM;
                    dateDiff(segregatedResult, arrS)
                    sortDateArray(arrS);
                    resultForName[0].["segregated"] = arrS;
                    setItems(resultForName[0])
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
                        <Text style={styles.text}>{items.segregated[0]} Dni</Text>
                    </Col>
                    <Col style={styles.gridElement}>
                        <Text style={styles.text}>Śmieci mieszane</Text>
                        <Text style={styles.text}>{items.mixed[0]} Dni</Text>
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
