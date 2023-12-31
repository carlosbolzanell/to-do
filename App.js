import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomePage from './src/HomePage';
import ItemList from './src/ItemList';
import TaskList from './src/TaskList';
import TaskPage from './src/TaskPage';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="TaskList" component={TaskList} />
        <Stack.Screen name="TaskPage" component={TaskPage} />
        <Stack.Screen name="ItemList" component={ItemList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}