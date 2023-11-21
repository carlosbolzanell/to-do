import React, { useState } from 'react';
import { View, TextInput, Pressable, Text } from 'react-native';
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
                    t.modified = new Date().toLocaleString();
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
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TextInput
                placeholder="Adicionar Item"
                value = {(propose == 'Adicionar' ? taskText : editName)}
                onChangeText={(propose == 'Adicionar' ? setTaskText : setEditName)}
                style={{borderWidth: 1, borderColor: 'black', width: '85%', margin: 'auto', height: 25, paddingLeft: 10, marginTop: 20}}
            />
            <Pressable onPress={() => {
                (propose == 'Adicionar' ? saveItem() : editItem());
                }} 
                style={{backgroundColor:"purple", borderWidth: 1, borderColor: 'black', width: '75%', height: '30px', margin: 'auto', alignItems: 'center', justifyContent: 'center', marginVertical: 20}}
            >
                <Text style={{color: 'white'}}>{propose}</Text>
            </Pressable>
        </View>
    )
}