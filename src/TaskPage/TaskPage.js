import { View, Text, Button, FlatList, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';

export default function TaskPage({navigation, route}) {

    const { list } = route.params; 

    const [itens, setItens] = useState([]);

    const focus = useIsFocused();
    useEffect(()=> {loadItens()}, [focus]);

    const loadItens = async() =>{
        try {
            const tasksFromStorage = await AsyncStorage.getItem('tasks');
            JSON.parse(tasksFromStorage).forEach((item)=>{
                if(item.text == list.text){
                    setItens(item.itens);
                }
            })

        } catch (error) {
            console.error('Erro ao carregar tarefas: ', error);
        }
    }

    return (

        <View>
            <Text>{list.text}</Text>

            <Button
                title="Adicionar Item"
                onPress={() => {
                    navigation.navigate("ItemList", {task: list})
                }}
            />

            <FlatList
                data={itens}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Pressable style={{ borderWidth: 1.5, borderColo: 'black', marginTop: 5, flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Text>{item.name}</Text>
                            <Text>{item.modified}</Text>
                        </View>
                        <View>
                            <Pressable onPress={() => {
                                removeItem(item);
                            }}>
                                <Text style={{ fontSize: 30 }}>🗑</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                )}
            />
        </View>
    )
}