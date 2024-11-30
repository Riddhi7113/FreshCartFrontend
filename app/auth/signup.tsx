import React, { useEffect, useState } from 'react';
import {
  TextInput,
  View,
  Text,
  Button,
  Pressable,
  Alert,
  useColorScheme,
  KeyboardAvoidingView,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Firebase_Auth } from '../../FirebaseConfig';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import { Ionicons } from '@expo/vector-icons';
import TabLayout from '../(tabs)/_layout';
import { router } from 'expo-router';


const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const colorScheme = useColorScheme();
  const router = useRouter();
  const auth = Firebase_Auth;

  const isDarkMode = colorScheme === 'dark';
  const backgroundColor = isDarkMode ? '#1a1a1a' : '#f8f9fa';
  const textColor = isDarkMode ? '#ffffff' : '#000000';

  // Google Login Setup
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '723516632615-5qdrm8qv32q977a3rblmg7r0v37rs7e2.apps.googleusercontent.com', // Replace with your actual Web Client ID
  });

  // Google login handling
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;

      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(async (userCredential) => {
          const token = await userCredential.user.getIdToken();
          await AsyncStorage.setItem('user_token', token);
          Alert.alert('Success', `Logged in as: ${userCredential.user.email}`);
          try {
              router.replace("/tabs/Home");       
          } catch (navError) {
            console.error('Navigation error:', navError);
            Alert.alert('Navigation Error', 'Could not navigate to tabs');
          }
        })
        .catch((error) => {
          console.error('Google login failed:', error.message);
          Alert.alert('Error', error.message || 'Failed to log in with Google.');
        });
    }
  }, [response]);

  // Handle email/password login or signup
  const handleAuth = async () => {
    try {
      if (isLogin) {
        // Login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        await AsyncStorage.setItem('user_token', token);
        console.log('Account created:', userCredential.user.email,token);
        // console.log(router.getState()); // Removed as getState does not exist on Router
        Alert.alert('Success', `Logged in as: ${userCredential.user.email}`);
        try {
          router.replace("/tabs/TabLayout");
        } catch (navError) {
          console.error('Navigation error:', navError);
          Alert.alert('Navigation Error', 'Could not navigate to tabs');
        }
      } else {
        // Signup
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        await AsyncStorage.setItem('user_token', token);
        
        Alert.alert('Success', `Account created for: ${userCredential.user.email}`);
        try {
          router.replace("/tabs/TabLayout");
        } catch (navError) {
          console.error('Navigation error:', navError);
          Alert.alert('Navigation Error', 'Could not navigate to tabs');
        }
      }
    } catch (error) {
      console.error('Authentication failed:', (error as any).message);
      const errorMessage = (error as any).message || 'An unknown error occurred.';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.imageContainer}>
      <Image
        source={require('../../assets/images/auth_image.png')} // Replace with your image path
        
        
      />
      </View>
      <View style={styles.authForm}>
        <TextInput
          style={[styles.input, { color: textColor, borderColor: textColor }]}
          placeholder="Email"
          placeholderTextColor="gray"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={[styles.input, { color: textColor, borderColor: textColor }]}
          placeholder="Password"
          placeholderTextColor="gray"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
        
        {/* Custom Login Button */}
        <TouchableOpacity style={[styles.button, { backgroundColor: isDarkMode ? '#1E90FF' : '#007AFF' }]} onPress={handleAuth}>
          <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
        </TouchableOpacity>

        <Pressable onPress={() => setIsLogin(!isLogin)}>
          <Text style={[styles.toggleText, { color: textColor }]}>
            {isLogin
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Login'}
          </Text>
        </Pressable>

        {/* Google Login Button */}
        <TouchableOpacity
          style={[styles.googleButton, { backgroundColor: '#DB4437' }]}
          onPress={() => {
            if (!request) {
              Alert.alert('Error', 'Google Sign-In is not supported on this device.');
            } else {
              promptAsync();
            }
          }}
        >
          <Ionicons name="logo-google" size={24} color="#fff" style={styles.googleIcon} />
          <Text style={styles.googleButtonText}>Login with Google</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#97c15c",
  },

  authForm: {
    backgroundColor: '#97c15c',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50, // Move form slightly up for overlap
  },
  imageContainer:{
    height:400,
    display:"flex",
    flexDirection:"column",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"#97c15c",

  },
  input: {
    height: 40,
    width: '80%',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 8,
  },
  button: {
    width: '80%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleText: {
    marginTop: 10,
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  googleButton: {
    width: '80%',
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  googleIcon: {
    marginRight: 10,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default AuthScreen;