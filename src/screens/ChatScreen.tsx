import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EventSource from 'react-native-event-source';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
}

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList<any>>(null);
  const esRef = useRef<EventSource | null>(null);

  // API配置 - 支持多个地址
  const API_CONFIGS = [
    'http://192.168.1.188:8888/easy/stream2',  // 局域网地址
  ];

  // 获取本机IP地址（用于调试）
  const getLocalIPAddress = () => {
    // 这里可以添加获取本机IP的逻辑
    return '192.168.1.188'; // 默认返回你的IP
  };

  // 处理消息内容，移除think标签并格式化显示
  const formatMessageContent = (content: string) => {
    // 移除<think>标签及其内容
    const withoutThink = content.replace(/<think>[\s\S]*?<\/think>/g, '');
    return withoutThink.trim();
  };

  // 检查消息是否包含think标签
  const hasThinkContent = (content: string) => {
    return /<think>[\s\S]*?<\/think>/.test(content);
  };

  // 提取think内容用于显示
  const extractThinkContent = (content: string) => {
    const thinkMatch = content.match(/<think>([\s\S]*?)<\/think>/);
    return thinkMatch ? thinkMatch[1].trim() : '';
  };

  // 测试API连接
  const testApiConnection = async (url: string): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 10000); // 10秒超时
      // 用普通fetch，不带SSE头
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'test' }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  // 找到可用的API地址
  const findWorkingApi = async (): Promise<string | null> => {
    console.log('开始查找可用的API地址...');
    console.log('本机IP地址:', getLocalIPAddress());
    // 直接返回第一个API地址，不做测试
    return API_CONFIGS[0] || null;
    
    for (const apiUrl of API_CONFIGS) {
      console.log(`测试API地址: ${apiUrl}`);
      const isWorking = await testApiConnection(apiUrl);
      if (isWorking) {
        console.log(`找到可用API: ${apiUrl}`);
        return apiUrl;
      }
    }
    
    console.log('所有API地址都无法连接');
    return null;
  };

  // 网络诊断功能
  const diagnoseNetwork = async () => {
    console.log('=== 开始网络诊断 ===');
    
    // 测试基本网络连接
    try {
      const testResponse = await fetch('https://httpbin.org/get', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('基本网络连接: ✅ 正常');
    } catch (error) {
      console.log('基本网络连接: ❌ 失败', error);
    }
    
    // 测试DNS解析
    try {
      const dnsResponse = await fetch('https://dns.google/resolve?name=192.168.1.188', {
        method: 'GET',
      });
      console.log('DNS解析: ✅ 正常');
    } catch (error) {
      console.log('DNS解析: ❌ 失败', error);
    }
    
    // 测试本地服务器连接
    const localServers = [
      'http://192.168.1.188:8888',
    ];
    
    for (const server of localServers) {
      try {
        const response = await fetch(server, {
          method: 'GET',
          headers: { 'Accept': 'text/html' },
        });
        console.log(`${server}: ✅ 可访问 (状态: ${response.status})`);
      } catch (error) {
        console.log(`${server}: ❌ 无法访问`, error);
      }
    }
    
    console.log('=== 网络诊断完成 ===');
  };

  useEffect(() => {
    // 页面卸载时关闭EventSource
    return () => {
      if (esRef.current) {
        esRef.current.close();
      }
    };
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    // 如果是测试消息，先进行网络诊断
    if (input.trim() === 'test' || input.trim() === '测试') {
      await diagnoseNetwork();
    }
    
    const userMsg: Message = { id: Date.now() + '', role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // 新增AI消息占位
    const aiMsgId = Date.now() + 'ai';
    setMessages(prev => [...prev, { id: aiMsgId, role: 'ai', content: 'AI正在思考，请稍候...' }]);

    try {
      // 首先尝试找到可用的API地址
      const workingApi = await findWorkingApi();
      
      if (!workingApi) {
        throw new Error('无法连接到AI服务，请检查网络连接和服务器状态');
      }

      // 更新消息为正在处理
      setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: '正在处理您的请求...' } : m));

      if (Platform.OS === 'web') {
        // Web端流式fetch
        const response = await fetch(workingApi, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
          body: JSON.stringify({ message: userMsg.content })
        });
        if (!response.ok) throw new Error(`服务器响应错误: ${response.status} ${response.statusText}`);
        if (!response.body) throw new Error('无流式响应，服务器可能不支持流式传输');
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: '' } : m));
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let aiContent = '';
        let buffer = '';
        let isFirstChunk = true;
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            for (const line of lines) {
              const trimmedLine = line.trim();
              if (trimmedLine.startsWith('data:')) {
                const content = trimmedLine.slice(5).trim();
                if (content) {
                  aiContent += content;
                  setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: aiContent } : m));
                  setTimeout(() => { flatListRef.current?.scrollToEnd({ animated: true }); }, 50);
                }
              }
            }
            if (isFirstChunk) { isFirstChunk = false; }
          }
          if (buffer.trim()) {
            const lines = buffer.split('\n');
            for (const line of lines) {
              const trimmedLine = line.trim();
              if (trimmedLine.startsWith('data:')) {
                const content = trimmedLine.slice(5).trim();
                if (content) {
                  aiContent += content;
                  setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: aiContent } : m));
                }
              }
            }
          }
        } catch (streamError) {
          throw new Error(`流式数据处理失败: ${streamError instanceof Error ? streamError.message : '未知错误'}`);
        } finally {
          try { await reader.cancel(); } catch {};
        }
        if (!aiContent.trim()) setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: 'AI服务返回了空响应，请重试' } : m));
      } else {
        // Android/iOS端用EventSource
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: '' } : m));
        const es = new EventSource(workingApi, {
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
          body: JSON.stringify({ message: userMsg.content })
        });
        esRef.current = es;
        let aiContent = '';
        es.addEventListener('message', (event: any) => {
          console.log('【EventSource message】', event);
          if (event.data) {
            aiContent += event.data;
            setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: aiContent } : m));
            setTimeout(() => { flatListRef.current?.scrollToEnd({ animated: true }); }, 50);
          }
        });
        es.addEventListener('error', (e: any) => {
          console.log('【EventSource error】', e);
          setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: 'AI服务暂时不可用，请稍后重试' } : m));
          setLoading(false);
          es.close();
        });
      }
      
    } catch (e) {
      console.error('AI服务错误:', e);
      const errorMessage = e instanceof Error ? e.message : '未知错误';
      
      // 显示详细的错误信息
      Alert.alert(
        '连接失败',
        `无法连接到AI服务：\n${errorMessage}\n\n请检查：\n1. 网络连接是否正常\n2. 服务器是否启动\n3. IP地址是否正确\n4. 服务器是否支持流式传输\n\n💡 提示：发送"测试"或"test"进行网络诊断`,
        [
          { text: '确定', style: 'default' },
          { 
            text: '网络诊断', 
            onPress: async () => {
              await diagnoseNetwork();
              setMessages(prev => prev.filter(m => m.id !== aiMsgId));
              setLoading(false);
            }
          },
          { 
            text: '重试', 
            onPress: () => {
              setMessages(prev => prev.filter(m => m.id !== aiMsgId));
              setLoading(false);
              sendMessage();
            }
          }
        ]
      );
      
      setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: `连接失败: ${errorMessage}` } : m));
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    // 每次渲染都分离think标签
    const thinkContent = extractThinkContent(item.content);
    const formattedContent = formatMessageContent(item.content);
    const hasThink = !!thinkContent;

    return (
      <View style={[styles.msgBubble, item.role === 'user' ? styles.user : styles.ai]}>
        {hasThink && (
          <View style={styles.thinkContainer}>
            <Text style={styles.thinkLabel}>🤔 思考过程：</Text>
            <Text style={styles.thinkContent}>{thinkContent}</Text>
          </View>
        )}
        {formattedContent && (
          <Text style={[styles.messageText, item.role === 'user' ? styles.userText : styles.aiText]}>
            {formattedContent}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={false}
          scrollIndicatorInsets={{ right: 1 }}
          indicatorStyle={Platform.OS === 'ios' ? 'default' : 'black'}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
          onLayout={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
          removeClippedSubviews={false}
          getItemLayout={(data, index) => ({
            length: 100, // 预估每个item的高度
            offset: 100 * index,
            index,
          })}
        />
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="请输入您的问题..."
            editable={!loading}
            multiline={true}
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendBtn, loading && styles.sendBtnDisabled]} 
            onPress={sendMessage} 
            disabled={loading}
          >
            <Text style={styles.sendBtnText}>{loading ? '发送中' : '发送'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messageList: {
    padding: 16,
    paddingBottom: 20,
    minHeight: '100%',
  },
  msgBubble: {
    maxWidth: '85%',
    marginBottom: 16,
    padding: 16,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: '#667eea',
  },
  ai: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#ffffff',
  },
  aiText: {
    color: '#333333',
  },
  thinkContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#ffc107',
  },
  thinkLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6c757d',
    marginBottom: 4,
  },
  thinkContent: {
    fontSize: 14,
    color: '#6c757d',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  inputBar: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 12,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sendBtn: {
    backgroundColor: '#667eea',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 40,
  },
  sendBtnDisabled: {
    backgroundColor: '#9ca3af',
  },
  sendBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ChatScreen; 