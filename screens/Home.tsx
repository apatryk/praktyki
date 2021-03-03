import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import React, { FC, useEffect, useState } from 'react';
import { FlatList, ListRenderItemInfo, Text, View } from 'react-native';
import { StackParamList } from '../App';
import { ActivityIndicator, StyleSheet } from 'react-native';

type HomeScreenProps = StackScreenProps<StackParamList, 'Home'>
type Category = {
    readonly id: string,
    readonly name: string,
}

const Item = ({ item }: ListRenderItemInfo<Category>, navigation: StackNavigationProp<StackParamList, 'Home'>) => (
    <View>
        <Text style={styles.text} onPress={() => {
            navigation.navigate('Details', { name: item.name });
        }}>{item.name}</Text>
    </View>
)

export const HomeScreen: FC<HomeScreenProps> = ({ navigation }) => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    function compare(a, b) {
      return a.name.localeCompare(b.name);
    }
    useEffect(() => {
        fetch("https://api.airtable.com/v0/appFD2g0OEjhkrviY/Piotrowice?api_key=keywAgs0R5LO4CpjY")
            .then(res => res.json())
            .then(
                (result) => {
                    var airtable_result = result.records.map(item => item.fields);
                    setIsLoaded(true);
                    setItems(airtable_result.sort(compare));
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
const styles = StyleSheet.create({
    text: {
        color: "#000000",
        fontWeight: "bold",
        fontSize: 18
    }
})
