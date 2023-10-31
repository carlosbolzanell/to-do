import * as React from 'react';
import { View, Button, TextInput, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState, useEffect } from 'react';
import { useIsFocused } from "@react-navigation/native";
import metadata from './src/storage.metadata.json'
import AsyncStorage from "@react-native-async-storage/async-storage";

function Tarefa() {
  return (
    <View style={{ width: '95%', height: 10, flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text>{props.nome}</Text>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <Text>🖊</Text>
        <Text>🗑</Text>
      </View>

    </View>
  )
}

function HomeScreen({ navigation }) {

  const [name, setName] = useState("");
  const [names, setNames] = useState([]);
  console.log(names);

  const getNames = () => {
    let nomesTemp = [...[names]];
    let nomeTemp = name;
    nomesTemp.push(nomeTemp);
    setNames(nomesTemp);
  }
  useEffect(() => { getNames() }, [name])

  const focus = useIsFocused();
  useEffect(() => { getUserName() }, [focus]);

  const getUserName = async () => {
    const userName = await AsyncStorage.getItem(metadata.USER.USERNAME);
    if (userName) {
      setName(userName);
    }
  }
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'start', margin: 30 }}>
      <Button
        title="Go to add list"
        onPress={() => navigation.navigate("Adicionar Tarefa")}
      />
      {
        names.map((nome) => {
          <View>
            <Text>{nome}</Text>
          </View>
        })
      }
    </View>
  );
}

function AddScreen({ navigation }) {
  const [name, setName] = useState("");
  useEffect(() => { getUserName() }, [])
  useEffect(() => { saveUserName() }, [name]);

  const getUserName = async () => {
    const userName = await AsyncStorage.getItem(metadata.USER.USERNAME);
    if (userName) {
      setName(userName);
    }
  }

  const saveUserName = async () => {
    const saveName = name || "";
    await AsyncStorage.setItem(metadata.USER.USERNAME, saveName);
  }
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'start', margin: 30 }}>
      <TextInput placeholder="Nome do Usuário" onChangeText={setName} style={{ borderWidth: 1.5, borderColor: 'black', marginBottom: 20, width: '95%', height: '5%', paddingLeft: 5 }} />
      <Button title='Adicionar' onPress={() => {
        navigation.navigate('Home')
      }} />
    </View>
  )
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Adicionar Tarefa" component={AddScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
