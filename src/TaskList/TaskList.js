import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Pressable, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { useIsFocused } from "@react-navigation/native";

const TaskList = ({ navigation }) => {
    const [tasks, setTasks] = useState([]);
    const [taskText, setTaskText] = useState('');

    const focus = useIsFocused();
    useEffect(()=> {loadTasks()}, [focus]);

    const loadTasks = async () => {
        try {
            const tasksFromStorage = await AsyncStorage.getItem('tasks');
            if (tasksFromStorage) {
                setTasks(JSON.parse(tasksFromStorage));
            }
            console.log(tasks);
        } catch (error) {
            console.error('Erro ao carregar tarefas: ', error);
        }
    };

    const saveTask = async () => {
        if (taskText.trim() === '') return;

        const newTask = {
            text: taskText,
            modified: format(new Date(), 'HH:mm:ss dd-MM-yyyy'),
        };

        const updatedTasks = [...tasks, newTask];
        console.log(updatedTasks);

        try {
            await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
            setTaskText('');
            setTasks(updatedTasks);
        } catch (error) {
            console.error('Erro ao salvar tarefa: ', error);
        }
    };

    return (
        <View>
            <TextInput
                placeholder="Adicionar tarefa"
                value={taskText}
                onChangeText={text => setTaskText(text)}
            />
            <Button title="Adicionar" onPress={() => {
                saveTask()
                navigation.navigate('Home');
            }}
            />

        </View>
    );
};

export default TaskList;