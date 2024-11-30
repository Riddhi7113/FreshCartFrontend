import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Image,
    ScrollView,
    TouchableOpacity,
Dimensions,
    SafeAreaView,
  } from 'react-native';


export function GloceryOptionsView({ title }: {title: string}) {
  return (
    <View style={styles.card} >
            <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    card: {
        width: 80,
        height: 120,
        padding: 8,
        backgroundColor: 'pink',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        marginBottom: 8,
      },
      title: {
        fontSize: 14,
      }
      
});