import React, { useState, useEffect } from 'react';
import { View, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { useIsFocused } from "@react-navigation/native";

const TaskList = ({ navigation }) => {
    const [tasks, setTasks] = useState([]);
    const [taskText, setTaskText] = useState('');
    const [cont, setCont] = useState(0);
    const [propose, setPropose] = useState('');

    const focus = useIsFocused();
    useEffect(()=> {loadTasks()}, [focus]);

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
            itens: ["Carlos", "Baseggio"],
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