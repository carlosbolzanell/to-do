import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";

export default function HomePage({ navigation }) {
    const [tasks, setTasks] = useState([]);
    const focus = useIsFocused();

    useEffect(() => {
        loadTasks()
    }, [focus]);

    const orderTasks = () => {
        const newTasks = [...tasks];
        newTasks.sort((a, b) => {
            if (b.modified >= a.modified) {
                return 1;
            } else {
                return -1
            }
        })
        return newTasks;
    }

    const removeItem = async (item) => {
        let taskTmp = [...tasks];
        const newTasks = taskTmp.filter(task => task.text != item.text);

        try {
            await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
            setTasks(newTasks);
        } catch {
            console.log("Erro ao setar as tasks", error);
        }
    }

    const loadTasks = async () => {
        try {
            const tasksFromStorage = await AsyncStorage.getItem('tasks');
            if (tasksFromStorage) {
                setTasks(JSON.parse(tasksFromStorage));
            }
        } catch (error) {
            console.error('Erro ao carregar tarefas: ', error);
        }
    };

    return (
        <View>
            <Text style={{fontSize: 20, textAlign: 'center', marginTop: 20}}>Bem Vindo a sua Lista de Lista de Tarefas</Text>
            <Pressable onPress={() => {
                    navigation.navigate("TaskList", { propose: 'Adicionar' });
                }} style={{backgroundColor:"purple", borderWidth: 1, borderColor: 'black', width: '75%', height: '30px', margin: 'auto', alignItems: 'center', justifyContent: 'center', marginVertical: 20}}
            >
                <Text style={{color: 'white'}}>Adicionar Tarefa</Text>

            </Pressable>


            <FlatList
                data={orderTasks()}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Pressable onPress={() => { navigation.navigate("TaskPage", { list: item }) }} style={{ borderWidth: 1.5, borderColor: 'black', marginTop: 5, flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, width: '85%', margin: 'auto' }}>
                        <View>
                            <Text>{item.text}</Text>
                        </View>
                        <View>
                            <Text>{item.modified}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <Pressable onPress={() => {
                                navigation.navigate('TaskList', {
                                    propose: 'Editar',
                                    item: item
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
                )}
            />
        </View>
    )
}