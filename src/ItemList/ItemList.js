import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

export default function ItemList({ navigation, route }) {

    const { atualTask, propose , itemEdit } = route.params;

    const [taskText, setTaskText] = useState('');
    const [editName, setEditName] = useState( itemEdit ? itemEdit.name : '');

    const saveItem = async () => {
        const newItem = {
            name: taskText,
            modified: format(new Date(), 'dd/MM/yyyy  HH:mm:ss'),
        };

        const tasksInStorage = await AsyncStorage.getItem('tasks');
        if (tasksInStorage) {
            const parsedTasks = JSON.parse(tasksInStorage);
            const updatedTasks = parsedTasks.map((t) => {
                if (t.text === atualTask.text) {
                    t.modified = format(new Date(), 'dd/MM/yyyy  HH:mm:ss');
                    t.itens.push(newItem);
                }
                return t;
            });
            console.log(updatedTasks)
            await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
        }
        navigation.navigate("TaskPage", { list: atualTask })
    }

    const editItem = async () =>{
        const tasksInStorage = await AsyncStorage.getItem('tasks');
        if (tasksInStorage) {
            const parsedTasks = JSON.parse(tasksInStorage);
            const updatedTasks = parsedTasks.map((t) => {
                if (t.text === atualTask.text) {
                    t.itens.map((itemEditable)=>{
                        if(itemEditable.name === itemEdit.name){
                            itemEditable.name = editName;
                            itemEditable.modified = format(new Date(), 'dd/MM/yyyy  HH:mm:ss');
                        }
                    })
                }
                return t;
            });
            await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
        }
        navigation.navigate("TaskPage", { list: atualTask })
    }

    return (
        <View>
            <TextInput
                placeholder="Adicionar Item"
                value = {(propose == 'Adicionar' ? taskText : editName)}
                onChangeText={(propose == 'Adicionar' ? setTaskText : setEditName)}
            />
            <Button title={propose} onPress={() => {
                (propose == 'Adicionar' ? saveItem() : editItem());
            }
            } />
        </View>
    )
}