import { View, Text, Button, FlatList, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';

export default function TaskPage({ navigation, route }) {

    const { list } = route.params;

    const [itens, setItens] = useState([]);

    const focus = useIsFocused();
    useEffect(() => { loadItens() }, [focus]);

    const orderItens = () => {
        const newItens = [...itens];
        newItens.sort((a, b) => {
            if (b.modified >= a.modified) {
                return 1;
            } else {
                return -1
            }
        })
        return newItens;
    }

    const loadItens = async () => {
        try {
            const tasksFromStorage = await AsyncStorage.getItem('tasks');
            JSON.parse(tasksFromStorage).forEach((item) => {
                if (item.text == list.text) {
                    setItens(item.itens);
                }
            })
        } catch (error) {
            console.error('Erro ao carregar tarefas: ', error);
        }
    }

    const removeItem = async (item) => {
        console.log(item);
        const tasksInStorage = await AsyncStorage.getItem('tasks');
        if (tasksInStorage) {
            const parsedTasks = JSON.parse(tasksInStorage);
            const updatedTasks = parsedTasks.map((t) => {
                if (t.text === list.text) {
                    const newItens = t.itens.filter(task => task.name != item.name)
                    t.modified = new Date().toLocaleString();
                    t.itens = newItens;
                    setItens(newItens);
                }
                return t;
            });
            await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
        }
    }

    return (

        <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 20 }}>Lista: {list.text}</Text>
            <Pressable onPress={() => {
                navigation.navigate("ItemList", {
                    atualTask: list,
                    propose: 'Adicionar'
                })
            }} style={{ backgroundColor: "purple", borderWidth: 1, borderColor: 'black', width: '75%', height: '30px', margin: 'auto', alignItems: 'center', justifyContent: 'center', marginVertical: 20 }}
            >
                <Text style={{ color: 'white' }}>Adicionar Tarefa</Text>

            </Pressable>

            <FlatList
                data={orderItens()}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={{marginBottom: 10, justifyContent: 'center', alignItems: 'center'}}>
                        <Pressable style={{ borderWidth: 1.5, borderColor: 'black', flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, width: '85%', margin: 'auto' }}>
                            <View>
                                <Text>{item.name}</Text>
                            </View>
                            <View>
                                <Text>{item.modified}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                <Pressable onPress={() => {
                                    navigation.navigate('ItemList', {
                                        atualTask: list,
                                        propose: 'Editar',
                                        itemEdit: item
                                    });
                                }}>
                                    <Text style={{ fontSize: 25 }}>🖊</Text>
                                </Pressable>
                                <Pressable onPress={() => {
                                    removeItem(item);
                                }}>
                                    <Text style={{ fontSize: 30 }}>🗑</Text>
                                </Pressable>
                            </View>
                        </Pressable>
                    </View>
                )}
            />
        </View>
    )
}