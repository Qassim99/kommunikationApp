import { SafeAreaView } from 'react-native-safe-area-context'
import PageTitle from '../components/PageTitle'
import PageContainer from '../components/PageContainer'
import { images, COLORS, SIZES, FONTS } from '../constants'
import { View, Text, Image } from 'react-native'
import Input from '../components/Input'
import Button from '../components/Button'
import instance from '../axios'
import { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginPage = ({ navigation }) => {
    const initialFormData = Object.freeze({
        username: '',
        password: '',
    })

    const [formData , updateFormData] = useState(initialFormData);
    const handleChange = (id, value) =>{
        updateFormData({
            ...formData,
            [id]: value.trim(),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await instance.post(`account/token/`, {
                username: formData.username,
                password: formData.password,
            });
    
            // Store tokens using AsyncStorage
            await AsyncStorage.setItem('access_token', response.data.access);
            await AsyncStorage.setItem('refresh_token', response.data.refresh);
            console.log(response.data.access)
            instance.defaults.headers['Authorization'] = 'JWT ' + response.data.access;
            
            // navigation to another site
            navigation.navigate('BottomTabNavigation');
        } catch (error) {
            console.error('Error during login:', error);
            // Handle error
        }
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <PageContainer>
                <PageTitle
                    title="Login"
                    onPress={() => navigation.navigate('Walkthrough')}
                />
                <View
                    style={{
                        width: '100%',
                        paddingHorizontal: 22,
                        paddingVertical: 32,
                        marginTop: 10,
                        alignItems: 'center',
                    }}
                >
                <Input
                    id="username"
                    placeholder="Benutzername"
                    onChangeText={(text) => handleChange('username', text)}
                />
                <Input
                    id="password"
                    placeholder="Passwort"
                    secureTextEntry={true}
                    onChangeText={(text) => handleChange('password', text)}
                />
                    <Text
                        onPress={() => navigation.navigate('PhoneNumber')}
                        style={{
                            ...FONTS.body3,
                            marginVertical: 12,
                        }}
                    >
                        Passwort vergessen?
                    </Text>
                    <Button
                        title="Login"
                        style={{
                            width: '100%',
                            paddingVertical: 12,
                            marginTop: 20,
                            marginBottom: 28,
                        }}
                       onPress={
                            handleSubmit
                        }
                    />
                    <Image
                        source={images.illustration}
                        resizeMode="contain"
                        style={{
                            width: SIZES.width * 0.8,
                            height: SIZES.width * 0.8,
                            //marginVertical: 28,
                        }}
                    />
                </View>
            </PageContainer>
        </SafeAreaView>
    )
}

export default LoginPage
