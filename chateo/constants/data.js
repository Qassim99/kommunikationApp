import images from './images'
import instance from '../axios'
export const contacts = [
    {
        id: '1',
        userName: 'Ayoub',
        userImg: images.user3,
        isOnline: false,
        lastSeen: '3 Days ago',
        lastMessage: 'How is it going...',
        messageInQueue: 3,
        sentDate: '12/7',
    },
    {
        id: '2',
        userName: 'Fares',
        userImg: images.user2,
        isOnline: true,
        lastSeen: 'Online',
        lastMessage: 'Good morning...',
        messageInQueue: 0,
        sentDate: '12/7',
    },
    {
        id: '3',
        userName: 'Qassem',
        userImg: images.user3,
        isOnline: false,
        lastSeen: '2 weeks ago',
        lastMessage: "What's up...",
        messageInQueue: 0,
        sentDate: '12/7',
    },
    {
        id: '4',
        userName: 'Alex',
        userImg: images.user4,
        isOnline: true,
        lastSeen: 'Online',
        lastMessage: 'Send me the link',
        messageInQueue: 0,
        sentDate: 'Today',
    },
    {
        id: '5',
        userName: 'Hevend',
        userImg: images.user2,
        isOnline: false,
        lastSeen: '5 days ago',
        lastMessage: 'We are doing...',
        messageInQueue: 0,
        sentDate: '23/9',
    },
    {
        id: '6',
        userName: 'Mohammed',
        userImg: images.user6,
        isOnline: false,
        lastSeen: '5 days ago',
        lastMessage: 'We are doing...',
        messageInQueue: 0,
        sentDate: '23/9',
    },
]

const fetchContacts = async () => {
    try {
        const response = await instance.get('chat/');
        const contacts = response.data;
        // Check if groups is defined and is an array
        if (contacts && Array.isArray(contacts)) {
          return contacts;
        } else {
          console.error('Invalid or missing groups data:', contacts);
          return [];
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
        return [];
      }
    };
  export const getContacts = async () => {
    try {
      const contacts = await fetchContacts();
  
      console.log(Array.isArray(contacts))
      const contactsMap = contacts.map(contact => ({
        id: contact.id,
        userName: contact.name,
        userImg: images.user2,
        isOnline: false,
        lastSeen: '5 days ago',
        lastMessage: 'We are doing...',
        messageInQueue: 0,
        sentDate: '23/9',
      }));
      console.log(contactsMap)
      if (Array.isArray(contacts)) {
        return contacts.map(contact => ({
          id: contact.id,
          userName: contact.name,
          userImg: images.user2,
          isOnline: false,
          lastSeen: '5 days ago',
          lastMessage: 'We are doing...',
          messageInQueue: 0,
          sentDate: '23/9',
        }));
      } else {
        console.error('Invalid contacts data:', contacts);
        return [];
      }
    } catch (error) {
      console.error('Error getting contacts:', error);
      return [];
    }
  };