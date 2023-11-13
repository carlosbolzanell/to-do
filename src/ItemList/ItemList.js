import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

export default function ItemList({ navigation, route }) {

    const { atualTask } = route.params;

    const [taskText, setTaskText] = useState('');

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
    }

    return (
        <View>
            <TextInput
                placeholder="Adicionar Item"
                onChangeText={setTaskText}
            />
            <Button title="Adicionar" onPress={() => {
                saveItem()
                navigation.navigate("TaskPage", { list: atualTask })
            }
            } />
        </View>
    )
}