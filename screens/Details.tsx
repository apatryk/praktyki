import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, Dimensions } from 'react-native';
import { ActivityIndicator, Colors } from 'react-native-paper';
import { View, Text } from 'react-native-ui-lib';
import { Col, Grid } from 'react-native-easy-grid';
import parse from 'date-fns/parse';
import differenceInDays from 'date-fns/differenceInDays';
import startOfToday from 'date-fns/startOfToday';

export const DetailsScreen: FC<DetailsScreenProps> = ({ route, navigation }) => {
    const { data } = route.params;
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    function dateDiff(a, b) {
        a.map(function (item) {
            const dateParse = parse(
                item,
                'dd/MM/yyyy',
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
        if (typeof data.mixed === 'string') {
            const mixedResult = data.mixed.split(',');
            const segregatedResult = data.segregated.split(',');
            let [arrS, arrM] = [[], []];
            dateDiff(mixedResult, arrM)
            data.["mixedDays"] = arrM;
            dateDiff(segregatedResult, arrS)
            data.["segregatedDays"] = arrS;
            setItems(data)
            setIsLoaded(true);
        } else {
            setItems(data)
            setIsLoaded(true);
        }
    }, [])
    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <View flex-1><Grid style={styles.grid}><ActivityIndicator animating={true} color={Colors.red800} /></Grid></View>;
    } else {
        return (
            <View style={styles.viewContainer}>
                <Grid style={styles.grid}>
                    <Col style={styles.gridElement}>
                        <View style={styles.iconCircle}>
                            <Image
                                style={styles.segLogo}
                                source={require('../assets/segregatedGarbage.png')}
                            />
                        </View>
                        <Text style={styles.text}>Śmieci segregowane</Text>
                        <Text style={styles.textDays}>{items.segregatedDays[0]} Dni</Text>
                    </Col>
                    <Col style={styles.gridElement}>
                    <View style={styles.iconCircle}>
                            <Image
                                style={styles.mixLogo}
                                source={require('../assets/garbageBin.png')}
                            />
                        </View>
                        <Text style={styles.text}>Śmieci mieszane</Text>
                        <Text style={styles.textDays}>{items.mixedDays[0]} Dni</Text>
                    </Col>
                </Grid>
            </View>
        );

    }
}
const styles = StyleSheet.create({
    viewContainer:{
        flex: 1,
        alignItems: 'center',
    },
    text: {
        color: "#000000",
        fontWeight: "bold",
        fontSize: 25,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    textDays: {
        color: "#000000",
        fontWeight: "bold",
        fontSize: 35,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    gridElement: {
        backgroundColor: '#48cae4',
        borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
        width: Dimensions.get('window').width * 0.75,
        height: Dimensions.get('window').width * 0.75,
        justifyContent: 'center',
    },
    grid: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    mixLogo: {
        width: 60,
        height: 60,
    },
    segLogo: {
        width: 80,
        height: 80,
    },
    iconCircle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 50 + 50 / 2,
        right: 0,
        backgroundColor: '#0096c7',
        position: 'absolute',
        top: 0,
    }
});
