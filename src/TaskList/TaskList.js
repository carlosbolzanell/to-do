import React, { useState, useEffect } from 'react';
import { View, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { useIsFocused } from "@react-navigation/native";

const TaskList = ({ navigation , route}) => {
    const [tasks, setTasks] = useState([]);
    const [taskText, setTaskText] = useState('');
    const { propose , item} = route.params;
    const [itemName, setItemName] = useState("");
    
    const focus = useIsFocused();
    useEffect(()=> {
        loadTasks()
        if(item){
            setItemName(item.text);
        }
    }, [focus]);

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

    const saveTask = async () => {
        if (taskText.trim() === '') return;

        const newTask = {
            text: taskText,
            modified: format(new Date(), 'dd/MM/yyyy  HH:mm:ss'),
            itens: [],
        };

        const updatedTasks = [...tasks, newTask];

        try {
            await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
            setTaskText('');
            setTasks(updatedTasks);
        } catch (error) {
            console.error('Erro ao salvar tarefa: ', error);
        }
    };

    const editTask = async () =>{
        const tasksInStorage = await AsyncStorage.getItem('tasks');
        if (tasksInStorage) {
            const parsedTasks = JSON.parse(tasksInStorage);
            const updatedTasks = parsedTasks.map((t) => {
                if (t.text === item.text) {
                    t.text = itemName
                    t.modified = format(new Date(), 'dd/MM/yyyy  HH:mm:ss')
                }
                return t;
            });
            await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
        }
    }

    return (
        <View>
            <TextInput
                placeholder= {`${propose} tarefa`}
                value = {(propose == 'add' ? taskText : itemName)}
                onChangeText={(propose == 'add' ? setTaskText : setItemName)}
            />
            <Button title={propose} onPress={() => {
                (propose == 'add' ? saveTask() : editTask());
                navigation.navigate('Home');
            }}
            />

        </View>
    );
};

export default TaskList;