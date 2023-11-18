import { View, Text, TouchableOpacity, Icon, StyleSheet } from 'react-native'
import React, { useEffect, useState, useCallback, DocumentPicker } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, SIZES, FONTS } from '../constants'
import { StatusBar } from 'expo-status-bar'
import { MaterialIcons, FontAwesome } from '@expo/vector-icons'
import { GiftedChat, Send, Bubble } from 'react-native-gifted-chat'
import instance from '../axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

const PersonalChat = ({ navigation, route }) => {
    const [messages, setMessages] = useState([]);
    const { groupId } = route.params;
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Replace with your WebSocket URL
        const ws = new WebSocket(`ws://192.168.43.223/ws/${groupId}/`);
        
        ws.onopen = () => {
            console.log('WebSocket Connected');
        };
        //receive message
        ws.onmessage = (e) => {
            console.log('Message from server: ', e.data);
        
            try {
                const incomingMessage = JSON.parse(e.data);
                // Format the incoming message to match GiftedChat's message format
                const formattedMessage = {
                    text: incomingMessage.message,
                    // username: incomingMessage.username,
                    createdAt: new Date(),
                    // user: {
                    //     _id: incomingMessage.sender,  // Ensure this ID is different from the current user's ID
                    //     // Add other user details here if available
                    // },
                };
        
                // Update the messages state to include the new message
                console.log([formattedMessage])
                // setMessages(previousMessages => GiftedChat.append(previousMessages, [formattedMessage]));
            } catch (error) {
                console.error('Error parsing incoming message:', error);
            }
        };
        ws.onerror = (e) => {
            // Handle errors
            console.error('WebSocket Error: ', e.message);
        };
    
        ws.onclose = (e) => {
            console.log('WebSocket Disconnected: ', e.code, e.reason);
        };
    
        setSocket(ws);
    
        return () => {
            ws.close();
        };
    }, [groupId]);

    useEffect(() => {
        const interval = setInterval(() => {
            const fetchData = async () => {
                try {
                    const accessToken = await AsyncStorage.getItem('access_token');

                    console.log('Access Token:', accessToken);
                    const response = await instance.get(`chat/group-chat-realtime/${groupId}/`, {
                        headers: {
                            Authorization: `JWT ${accessToken}`,
                        },
                    });
                    const formattedMessages = response.data.map(msg => ({
                        _id: msg.id,
                        text: msg.content,
                        createdAt: new Date(msg.timestamp),
                        user: {
                            _id: msg.sender,
                        },
                    })).reverse();
        
                    setMessages(formattedMessages);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
        
            fetchData();

          }, 100000);
          return () => clearInterval(interval);
        
    }, [groupId]);

    // const onSend = useCallback((messages = []) => {
    //     setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    
    //     if (!socket || socket.readyState !== WebSocket.OPEN) {
    //         console.log('WebSocket is not connected. Attempting to reconnect...');
    //         setSocket(new WebSocket(`ws://192.168.43.223/ws/${groupId}/`));
    //     }
    
    //     if (socket && socket.readyState === WebSocket.OPEN) {
    //         const [newMessage] = messages;
    //         const messageToSend = JSON.stringify({
    //             content: newMessage.text,
    //             // Include other necessary fields
    //         });
    
    //         console.log('Sending message:', messageToSend);
    //         socket.send(messageToSend);
    //     } else {
    //         console.log('WebSocket connection could not be established.');
    //     }
    // }, [socket, groupId]);

    const onSend = useCallback((messages = []) => {
        const [newMessage] = messages;
    
        // Format the message for sending through WebSocket
        const messageToSend = JSON.stringify({
            message: newMessage.text, // Message text
            username: "kassim" // ID of the sender (assuming it's in the user object of the message)
            // groupId: groupId, // ID of the chat group, obtained from route params
            // Include any other fields required by your backend
        });
    
        // Send the message through WebSocket if it's open
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(messageToSend);
    
            // Immediately add this message to your chat
            setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
        } else {
            console.log('WebSocket is not connected. Unable to send message.');
        }
    }, [socket, groupId]); // Include groupId in the dependency array if it's a prop

    const pickDocument = async () => {
        /*try {
            const result = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.allFiles],
                copyTo: 'documentDirectory',
                mode: 'import',
                allowMultiSelection: true,
            })
            const fileUri = result[0].fileCopyUri
            if (!fileUri) {
                console.log('File URI is undefined or null')
                return
            }
            if (
                fileUri.indexOf('.png') !== -1 ||
                fileUri.indexOf('.jpg') !== -1
            ) {
                setImagePath(fileUri)
                setIsAttachImage(true)
            } else {
                setFilePath(fileUri)
                setIsAttachFile(true)
            }
        } catch (err) {
            
            if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled file picker')
            } else {
                console.log('DocumentPicker err => ', err)
                throw err
            }
            
        }*/
        try {
            const result = await DocumentPicker.show({
                type: 'application/pdf',
            })
            console.log(
                result.uri,
                result.type, // mime type
                result.name,
                result.size
            )
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker
            } else {
                throw err
            }
        }
    }

    // change button of send
    const renderSend = (props) => {
        return (
            /*<Send {...props}>
                <View
                    style={{
                        height: 36,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 36,
                        borderRadius: 18,
                        backgroundColor: COLORS.primary,
                        marginRight: 5,
                        marginBottom: 5,
                    }}
                >
                    <FontAwesome name="send" size={12} color={COLORS.white} />
                </View>
            </Send>
            */

            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={pickDocument}>
                    <View
                        style={{
                            height: 36,
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 36,
                            borderRadius: 18,
                            backgroundColor: COLORS.primary,
                            marginTop: 5,
                            marginRight: 5,
                            marginBottom: 5,
                        }}
                    >
                        <FontAwesome
                            name="paperclip"
                            size={18}
                            color={COLORS.white}
                        />
                    </View>
                </TouchableOpacity>

                <Send {...props}></Send>
            </View>
        )
    }

    // customize sender messages
    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: COLORS.green,
                    },
                    left: {
                        backgroundColor: COLORS.primary,
                    },
                }}
                textStyle={{
                    right: {
                        color: COLORS.white,
                    },
                    left: {
                        color: COLORS.white,
                    },
                }}
            />
        )
    }
    return (
        <SafeAreaView style={{ flex: 1, color: COLORS.secondaryWhite }}>
            <StatusBar style="light" backgroundColor={COLORS.white} />
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 22,
                    backgroundColor: COLORS.white,
                    height: 60,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Chats')}
                    >
                        <MaterialIcons
                            name="keyboard-arrow-left"
                            size={24}
                            color={COLORS.black}
                        />
                    </TouchableOpacity>
                    <Text style={{ ...FONTS.h4, marginLeft: 8 }}>
                        Athalia Muri
                    </Text>
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <TouchableOpacity
                        onPress={() => console.log('search')}
                        style={{
                            marginRight: 8,
                        }}
                    >
                        <MaterialIcons
                            name="search"
                            size={24}
                            color={COLORS.black}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => console.log('Menu')}
                        style={{
                            marginRight: 8,
                        }}
                    >
                        <MaterialIcons
                            name="menu"
                            size={24}
                            color={COLORS.black}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <GiftedChat
                messages={messages}
                onSend={(messages) => onSend(messages)}
                user = {
                    {
                        _id: 1,
                        // username: "kassim"
                    }
                }
                renderBubble={renderBubble}
                alwaysShowSend
                renderSend={renderSend}
                scrollToBottom
                textInputStyle={{
                    borderRadius: 22,
                    borderWidth: 1,
                    borderColor: COLORS.gray,
                    marginRight: 6,
                    paddingHorizontal: 12,
                }}
            />
        </SafeAreaView>
    )
}

export default PersonalChat
