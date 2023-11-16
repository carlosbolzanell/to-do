import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ItemList({ navigation, route }) {

    const { atualTask, propose , itemEdit } = route.params;

    const [taskText, setTaskText] = useState('');
    const [editName, setEditName] = useState( itemEdit ? itemEdit.name : '');

    const saveItem = async () => {
        const newItem = {
            name: taskText,
            modified: new Date().toLocaleString(),
        };

        const tasksInStorage = await AsyncStorage.getItem('tasks');
        if (tasksInStorage) {
            const parsedTasks = JSON.parse(tasksInStorage);
            const updatedTasks = parsedTasks.map((t) => {
                if (t.text === atualTask.text) {
                    t.modified = new Date().toLocaleString();
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
                            itemEditable.modified = new Date().toLocaleString();
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