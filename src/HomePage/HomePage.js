import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import { parse } from 'date-fns';

export default function HomePage({ navigation }) {
    const [tasks, setTasks] = useState([]); 
    const focus = useIsFocused();
    
    useEffect(() => { 
        loadTasks()
    }, [focus]);

    function parseDateString(dateString) {
        return parse(dateString, 'dd/MM/yyyy HH:mm:ss', new Date());
    }

    const orderList = async() =>{
        const newList = [...tasks];
        newList.sort((a, b) => parseDateString(a.modified) - parseDateString(b.modified));
        try{
            await AsyncStorage.setItem('tasks', JSON.stringify(newList));
            setTasks(newList); 
        }catch{
            console.log("Erro ao setar as tasks", error);
        }
    }

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
                    orderList();
                    navigation.navigate("TaskList", {propose: 'add'});
                }}
            />

            <FlatList
                data={tasks}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Pressable onPress={()=>{navigation.navigate("TaskPage", {list: item})}} style={{ borderWidth: 1.5, borderColo: 'black', marginTop: 5, flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>
                        <View>
                            <Text>{item.text}</Text>
                        </View>
                        <View>
                            <Text>{item.modified}</Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                            <Pressable onPress={() => {
                                navigation.navigate('TaskList', {
                                    propose: 'edit',
                                    item: item
                                });
                            }}>
                                <Text style={{fontSize: 25}}>🖊</Text>
                            </Pressable>
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