import { View, Text, Button, FlatList, Pressable } from 'react-native';

export default function TaskPage(){
    return(
        <View>
             <Button
                title="Adicionar Tarefa"
                onPress={() => {
                    navigation.navigate("TaskList")
                }}
            />

            <FlatList
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Pressable style={{ borderWidth: 1.5, borderColo: 'black', marginTop: 5, flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Text>{item.text}</Text>
                            <Text>{item.modified}</Text>
                        </View>
                        <View>
                            <Pressable onPress={() => {
                                removeItem(item);
                            }}>
                                <Text style={{fontSize: 30}}>🗑</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                )}
            />
        </View>
    )
}