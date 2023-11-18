import {
    View,
    StyleSheet,
    Text,
    Platform,
    Pressable,
    TextInput,
    ProgressViewIOSComponent,
    TouchableOpacity,
    ScrollView,
} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import PageContainer from '../components/PageContainer'
import { COLORS } from '../constants'
import { AntDesign } from '@expo/vector-icons'
import Input from '../components/Input'
import Button from '../components/Button'
import PageTitle from '../components/PageTitle'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useState } from 'react'

const ProfileAccount = ({ navigation }) => {
    const [date, setDate] = useState(new Date())
    const [showPicker, setShowPicker] = useState(false)
    const [dateOfBirth, setDateOfBirth] = useState('')

    const toggelDatepicker = () => {
        setShowPicker(!showPicker)
    }

    const onChange = ({ type }, selectedDate) => {
        if (type == 'set') {
            const currentDate = selectedDate
            setDate(currentDate)

            if (Platform.OS === 'android') {
                toggelDatepicker()
                setDateOfBirth(currentDate.toDateString())
            }
        } else {
            toggelDatepicker()
        }
    }

    const confirmIOSDate = () => {
        setDateOfBirth(date.toDateString())
        toggelDatepicker()
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <PageContainer>
                <PageTitle
                    title="Your Profile"
                    onPress={() => navigation.navigate('Verification')}
                />
                <ScrollView>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <View
                            style={{
                                width: 100,
                                height: 100,
                                backgroundColor: COLORS.secondaryWhite,
                                borderRadius: 50,
                                marginVertical: 48,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <AntDesign
                                name="user"
                                size={64}
                                color={COLORS.black}
                            />
                            <View
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                }}
                            >
                                <AntDesign
                                    name="pluscircle"
                                    size={24}
                                    color={COLORS.black}
                                />
                            </View>
                        </View>

                        <View style={{ width: '100%', paddingHorizontal: 22 }}>
                            <Text>Username</Text>
                            <Input id="firstName" placeholder="First Name" />
                            <Input id="lastName" placeholder="Last Name " />

                            <Text>Date of Birth</Text>
                            {showPicker && (
                                <DateTimePicker
                                    mode="date"
                                    display="spinner"
                                    value={date}
                                    onChange={onChange}
                                    style={StyleSheet.datePicker}
                                />
                            )}

                            {showPicker && Platform.OS === 'ios' && (
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                    }}
                                >
                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            styles.pickerButton,
                                            { backgroundColor: '#11182711' },
                                        ]}
                                        onPress={toggelDatepicker}
                                    >
                                        <Text
                                            style={[
                                                styles.buttonText,
                                                { color: '#075985' },
                                            ]}
                                        >
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            styles.pickerButton,
                                        ]}
                                        onPress={confirmIOSDate}
                                    >
                                        <Text style={[styles.buttonText]}>
                                            Confirm
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {!showPicker && (
                                <Pressable onPress={toggelDatepicker}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Aug 11 1999"
                                        value={dateOfBirth}
                                        onChangeText={setDateOfBirth}
                                        //placeholderTextColor="11182744"
                                        editable={false}
                                        onPressIn={toggelDatepicker}
                                    />
                                </Pressable>
                            )}

                            <Button
                                title="Save"
                                style={{
                                    width: '100%',
                                    paddingVertical: 12,
                                    marginBottom: 48,
                                    marginTop: 20,
                                }}
                                onPress={() =>
                                    navigation.navigate('BottomTabNavigation')
                                }
                            />
                        </View>
                    </View>
                </ScrollView>
            </PageContainer>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: COLORS.secondaryWhite,
        height: 50,
        fontSize: 14,
        fontWeight: '500',
        color: '#111827cc',
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#11182711',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#fff',
    },
    datePicker: {
        height: 120,
        marginTop: -10,
    },
    button: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 15,
        backgroundColor: '#075985',
    },
    pickerButton: {
        paddingHorizontal: 20,
    },
})

export default ProfileAccount
