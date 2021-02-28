import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import React, { FC, useEffect, useState } from 'react';
import { FlatList, ListRenderItemInfo, Text, View } from 'react-native';
import { StackParamList } from '../App';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet } from 'react-native';
import * as dayjs from 'dayjs';
import { LogBox } from 'react-native'

type HomeScreenProps = StackScreenProps<StackParamList, 'Home'>
type Category = {
    readonly id: string,
    readonly name: string,
}

const Item = ({ item }: ListRenderItemInfo<Category>, navigation: StackNavigationProp<StackParamList, 'Home'>) => (
    <View>
        <Text onPress={() => {
            navigation.navigate('Details', { name: item.name });
        }}>{item.name}</Text>
    </View>
)

export const HomeScreen: FC<HomeScreenProps> = ({ navigation }) => {

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);

    // Note: the empty deps array [] means
    // this useEffect will run once
    // similar to componentDidMount()
    useEffect(() => {
        var Airtable = require('airtable');
        var base = new Airtable({ apiKey: '--------------' }).base('appFD2g0OEjhkrviY');
        base('Piotrowice').select({
            // Selecting the first 3 records in Grid view:

            view: "Grid view"
        }).eachPage(function page(records: Array<any>, fetchNextPage) {
            setItems(records.map(record => { return record.fields }));
            records.forEach(function (record) {
                var ajdi = record.id
                base('Piotrowice').find(ajdi, function (err, record) {
                    if (err) { console.error(err); return; }
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
            }
            );
    }, [])
    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <ActivityIndicator size="large" />;
    } else {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <FlatList
                    data={items}
                    renderItem={(item) => Item(item, navigation)}
                    keyExtractor={(item) => item.name}
                />
            </View>
        );
    }
}