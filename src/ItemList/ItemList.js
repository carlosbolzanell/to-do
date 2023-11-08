import React, { useState, useEffect } from 'react';
import { View, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { useIsFocused } from "@react-navigation/native";

export default function ItemList ({navigation, route}){

    const {task} = route.params;

    const [taskText, setTaskText] = useState('');

    const saveTask = async () => {
        if (taskText.trim() === '') return;

        const newTask = {
            text: taskText,
            modified: format(new Date(), 'dd/MM/yyyy  HH:mm:ss'),
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

    const saveItem = () =>{
        // if(taskText.trim() === '') return;

        const newItem = {
            name: taskText,
            modified: format(new Date(), 'dd/MM/yyyy  HH:mm:ss'),
        };
        
        task.itens.push(newItem);
        setTaskText('');
    }

    return(
        <View>
            <TextInput
                placeholder="Adicionar Item"
                onChangeText={()=>{text=>setTaskText(text)}}
            />
            <Button title="Adicionar" onPress={()=>{
                saveItem()
                navigation.navigate("TaskPage", { list: task})}
            } />
        </View>
    )
}