import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { FC, useEffect, useState } from 'react';
import * as React from 'react';
import { FlatList, ListRenderItemInfo, Image, Alert } from 'react-native';
import { StackParamList } from '../App';
import { ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import startOfToday from 'date-fns/startOfToday';
import { useNetInfo } from "@react-native-community/netinfo";
import {
    Text,
    Container,
    Header,
    Content,
    List,
    ListItem,
    Left,
    Body,
    Icon,
    Right,
    Title,
    Button,
    Picker
} from "native-base";
import { useNavigationBuilder } from '@react-navigation/core';
import { apiUrl } from '../Api';

type HomeScreenProps = StackScreenProps<StackParamList, 'Home'>
type Category = {
    readonly id: string,
    readonly name: string,
}
function _renderItem({ item }: ListRenderItemInfo<Category>, navigation: StackNavigationProp<StackParamList, 'Home'>) {
    if (item.header) {
        return (
            <ListItem itemDivider>
                <Left />
                <Body style={{ marginRight: 40 }}>
                    <Text style={{ fontWeight: "bold" }}>
                        {item.name}
                    </Text>
                </Body>
                <Right />
            </ListItem>
        );
    } else if (!item.header) {
        return (
            <ListItem style={{ marginLeft: 0 }}>
                <Body>
                    <Text onPress={() => {
                        navigation.navigate('Details', { data: item });
                    }}>{item.name}</Text>
                </Body>
            </ListItem >
        );
    }
};
const alert = (a, b) =>
    Alert.alert(
        a,
        b,
        [
            {
                text: "Cancel",
            },
        ]
    );
var runFunctionOnce;
const runOnce = (a, b) => {
    if (!runFunctionOnce) {
        runFunctionOnce = true;
        alert(a, b)
    }
}
let arr = [];
export const HomeScreen: FC<HomeScreenProps> = ({ navigation }) => {
    const netInfo = useNetInfo();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    function compare(a, b) {
        return a.name.localeCompare(b.name);
    }
    const storeData = async (key, value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem(key, jsonValue)
        } catch (e) {
            // saving error
        }
    }
    const getData = async (key) => {
        try {
            const jsonValue = await AsyncStorage.getItem(key)
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            // error reading value
        }
    }
    useEffect(() => {
        fetch('https://api.airtable.com/v0/appFD2g0OEjhkrviY/Cities' + apiUrl.key)
            .then(res => res.json())
            .then(
                (result) => {
                    const test1 = result.records.map(item => item.fields);
                    const test = test1.sort(compare);
                    let test2 = [];
                    test.map((item) => {
                        const cityName = item.name;
                        fetch('https://api.airtable.com/v0/appFD2g0OEjhkrviY/' + cityName + apiUrl.key)
                            .then(res => res.json())
                            .then((result) => {
                                const airtableResult = result.records.map(item => item.fields);
                                const sortedResult = airtableResult.sort(compare);
                                const obj = {};
                                obj.name = cityName;
                                obj.header = true;
                                sortedResult.unshift(obj);
                                test2.push(sortedResult);
                                const mergedResults = [].concat.apply([], test2);
                                setItems(mergedResults);
                                const lolz = async () => {
                                    await storeData('key', mergedResults);
                                }
                                lolz()
                                setIsLoaded(true);
                            })
                    })
                }
            )
    }, [])
    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <ActivityIndicator size="large" />;
    } else if (isLoaded && netInfo.isConnected) {
        return (
            <FlatList
                data={items}
                renderItem={(item) => _renderItem(item, navigation)}
                keyExtractor={item => item.name}
                stickyHeaderIndices={arr}
            />
        );
    }
    else if (!netInfo.isConnected) {
        const asynfunction = async () => {
            setItems(await getData('key'));
        }
        asynfunction()
        runOnce('Jesteś w trybie offline!', 'xD');
        return (
            <FlatList
                data={items}
                renderItem={(item) => _renderItem(item, navigation)}
                keyExtractor={item => item.name}
                stickyHeaderIndices={arr}
            />
        )
    }
}
const styles = StyleSheet.create({
    text: {
        color: "#000000",
        fontWeight: "bold",
        fontSize: 18
    },
    tinyLogo: {
        width: 50,
        height: 50,
    },
})
