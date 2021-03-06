// import React, { useState } from 'react';
// import { FlatList, StyleSheet } from 'react-native';
// import {
//   ListItem,
//   ListItemDeleteAction,
//   ListItemSeparator,
// } from '../components/lists';
// import Screen from '../components/Screen';

// const initialMessages = [
//   {
//     id: 1,
//     title: 'Jose',
//     description: 'Hey! Cool Leap!',
//     image: require('../assets/jose.jpg'),
//   },
//   {
//     id: 2,
//     title: 'Karl Horky',
//     description: 'Hi',
//     image: require('../assets/karl.jpg'),
//   },
// ];

// function MessagesScreen(props) {
//   const [messages, setMessages] = useState(initialMessages);
//   const [refreshing, setRefreshing] = useState(false);

//   const handleDelete = (message) => {
//     // Delete the message from messages
//     setMessages(messages.filter((m) => m.id !== message.id));
//   };

//   return (
//     <Screen>
//       <FlatList
//         data={messages}
//         keyExtractor={(message) => message.id.toString()}
//         renderItem={({ item }) => (
//           <ListItem
//             title={item.title}
//             subTitle={item.description}
//             image={item.image}
//             onPress={() => console.log('Message selected', item)}
//             renderRightActions={() => (
//               <ListItemDeleteAction onPress={() => handleDelete(item)} />
//             )}
//           />
//         )}
//         ItemSeparatorComponent={ListItemSeparator}
//         refreshing={refreshing}
//         onRefresh={() => {
//           setMessages([
//             {
//               id: 2,
//               title: 'T2',
//               description: 'D2',
//               image: require('../assets/mosh.jpg'),
//             },
//           ]);
//         }}
//       />
//     </Screen>
//   );
// }

// const styles = StyleSheet.create({});

// export default MessagesScreen;
