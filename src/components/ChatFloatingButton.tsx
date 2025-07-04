import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  onPress: () => void;
}

const ChatFloatingButton: React.FC<Props> = ({ onPress }) => (
  <TouchableOpacity style={styles.fab} onPress={onPress}>
    <Ionicons name="chatbubble-ellipses" size={28} color="#fff" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 40,
    backgroundColor: '#667eea',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    zIndex: 100,
  },
});

export default ChatFloatingButton; 