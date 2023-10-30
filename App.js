import * as React from 'react';
import { View, Button, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'start', margin: 30 }}>
      <Button title='Adicionar Lista' onPress={() => navigation.navigate('Adicionar Tarefa')}/>
    </View>
  );
}

function AddScreen({ navigation }){
  return(
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'start', margin: 30 }}>
      <TextInput placeholder='Escreva o nome da tarefa' placeholderTextColor= 'black' style={{borderWidth: 1.5, borderColor: 'black', marginBottom: 20, width: '95%', height: '5%', paddingLeft: 5}}/>
      <Button title='Me aperte' onPress={() => navigation.navigate('Home')}/>
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
