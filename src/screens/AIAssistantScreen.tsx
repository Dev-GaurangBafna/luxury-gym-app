import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Bot, Send, Sparkles, MessageCircle } from 'lucide-react-native';

import { Colors, Typography, Spacing, Layout, BorderRadius } from '../constants/theme';
import { GlassCard } from '../components/ui/GlassCard';
import { LuxuryButton } from '../components/ui/LuxuryButton';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const AIAssistantScreen: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI fitness coach. I can help you with workout plans, nutrition advice, form tips, and answer any fitness questions you have. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        isUser: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: "Thanks for your question! I'm processing your request and will provide you with personalized advice based on your fitness goals and current progress.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const renderMessage = (msg: Message) => {
    if (msg.isUser) {
      return (
        <View key={msg.id} style={styles.userMessageContainer}>
          <LinearGradient
            colors={Colors.goldGradient}
            style={styles.userMessage}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.userMessageText}>{msg.text}</Text>
          </LinearGradient>
        </View>
      );
    }

    return (
      <View key={msg.id} style={styles.aiMessageContainer}>
        <LinearGradient
          colors={[Colors.primary, Colors.secondary]}
          style={styles.aiAvatar}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Bot size={20} color={Colors.white} />
        </LinearGradient>
        <GlassCard style={styles.aiMessage}>
          <Text style={styles.aiMessageText}>{msg.text}</Text>
        </GlassCard>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={Colors.goldGradient}
          style={styles.headerIcon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Sparkles size={24} color={Colors.background} />
        </LinearGradient>
        <View style={styles.headerText}>
          <Text style={styles.title}>AI Coach</Text>
          <Text style={styles.subtitle}>Your personal fitness assistant</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <LuxuryButton
            title="Create Workout"
            variant="outline"
            size="small"
            onPress={() => setMessage("Create a workout plan for me")}
            style={styles.quickActionButton}
          />
          <LuxuryButton
            title="Nutrition Tips"
            variant="outline"
            size="small"
            onPress={() => setMessage("Give me nutrition advice")}
            style={styles.quickActionButton}
          />
          <LuxuryButton
            title="Form Check"
            variant="outline"
            size="small"
            onPress={() => setMessage("Help me with exercise form")}
            style={styles.quickActionButton}
          />
          <LuxuryButton
            title="Recovery"
            variant="outline"
            size="small"
            onPress={() => setMessage("How can I improve recovery?")}
            style={styles.quickActionButton}
          />
        </ScrollView>
      </View>

      {/* Messages */}
      <ScrollView 
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}
      </ScrollView>

      {/* Input */}
      <GlassCard style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={message}
            onChangeText={setMessage}
            placeholder="Ask me anything about fitness..."
            placeholderTextColor={Colors.gray}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <LinearGradient
              colors={message.trim() ? Colors.goldGradient : [Colors.darkGray, Colors.darkGray]}
              style={styles.sendButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Send size={20} color={message.trim() ? Colors.background : Colors.gray} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </GlassCard>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.screenPadding,
    paddingBottom: Spacing.md,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.gray,
  },
  
  // Quick Actions
  quickActions: {
    paddingHorizontal: Layout.screenPadding,
    marginBottom: Spacing.md,
  },
  quickActionButton: {
    marginRight: Spacing.sm,
  },
  
  // Messages
  messagesContainer: {
    flex: 1,
    paddingHorizontal: Layout.screenPadding,
  },
  messagesContent: {
    paddingBottom: Spacing.lg,
  },
  
  // User Messages
  userMessageContainer: {
    alignItems: 'flex-end',
    marginBottom: Spacing.md,
  },
  userMessage: {
    maxWidth: '80%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderBottomRightRadius: 8,
  },
  userMessageText: {
    fontSize: Typography.fontSize.base,
    color: Colors.background,
    fontWeight: Typography.fontWeight.medium,
  },
  
  // AI Messages
  aiMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  aiAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    marginTop: Spacing.xs,
  },
  aiMessage: {
    flex: 1,
    maxWidth: '80%',
    padding: Spacing.md,
    borderBottomLeftRadius: 8,
  },
  aiMessageText: {
    fontSize: Typography.fontSize.base,
    color: Colors.white,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  
  // Input
  inputContainer: {
    margin: Layout.screenPadding,
    marginBottom: Layout.screenPadding + 100, // Account for tab bar
    padding: Spacing.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.white,
    maxHeight: 100,
    marginRight: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  sendButton: {
    marginBottom: Spacing.xs,
  },
  sendButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
