import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";

export default function HomePage({ navigation }) {
    const [tasks, setTasks] = useState([]);

    useEffect(() => { loadTasks }, []);

    const focus = useIsFocused();
    useEffect(() => { loadTasks() }, [focus]);

    const removeItem = async (item) =>{
        let taskTmp = [...tasks];
        const newTasks = taskTmp.filter(task=> task.text != item.text);

        try{
            await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
            setTasks(newTasks);
        }catch{
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
            <Button
                title="Adicionar Tarefa"
                onPress={() => {
                    navigation.navigate("TaskList")
                }}
            />

            <FlatList
                data={tasks}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Pressable style={{ borderWidth: 1.5, borderColo: 'black', marginTop: 5, flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Text>{item.text}</Text>
                            <Text>{item.modified}</Text>
                        </View>
                        <View>
                            <Pressable onPress={() => {
                                removeItem(item);
                            }}>
                                <Text style={{fontSize: 30}}>🗑</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                )}
            />
        </View>
    )
}