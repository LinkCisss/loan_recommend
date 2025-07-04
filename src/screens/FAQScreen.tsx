import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

type RootStackParamList = {
  Chat: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const FAQScreen: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const navigation = useNavigation<NavigationProp>();

  const categories = ['全部', '申请流程', '贷款产品', '还款问题', '账户安全'];

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: '如何申请贷款？',
      answer: '您可以通过以下步骤申请贷款：\n1. 注册并登录账户\n2. 选择适合的贷款产品\n3. 填写申请信息\n4. 提交审核\n5. 等待审核结果',
      category: '申请流程',
    },
    {
      id: 2,
      question: '申请贷款需要什么条件？',
      answer: '基本条件包括：\n• 年满18周岁\n• 有稳定收入\n• 良好的信用记录\n• 提供必要的身份证明和收入证明',
      category: '申请流程',
    },
    {
      id: 3,
      question: '贷款审核需要多长时间？',
      answer: '一般情况下，我们的审核时间为1-3个工作日。具体时间取决于您提供的资料完整性和贷款类型。',
      category: '申请流程',
    },
    {
      id: 4,
      question: '有哪些贷款产品可以选择？',
      answer: '我们提供多种贷款产品：\n• 个人消费贷款\n• 信用贷款\n• 抵押贷款\n• 汽车贷款\n每种产品都有不同的额度和利率。',
      category: '贷款产品',
    },
    {
      id: 5,
      question: '贷款利率是如何计算的？',
      answer: '贷款利率根据您的信用评分、贷款金额、期限等因素综合确定。我们采用AI算法为您提供最优的利率方案。',
      category: '贷款产品',
    },
    {
      id: 6,
      question: '如何还款？',
      answer: '我们支持多种还款方式：\n• 银行卡自动扣款\n• 网银转账\n• 手机银行还款\n• 第三方支付平台',
      category: '还款问题',
    },
    {
      id: 7,
      question: '可以提前还款吗？',
      answer: '是的，您可以提前还款。提前还款可能会产生一定的手续费，具体费用请查看您的贷款合同。',
      category: '还款问题',
    },
    {
      id: 8,
      question: '逾期还款会有什么影响？',
      answer: '逾期还款会影响您的信用记录，并可能产生额外的罚息。建议您按时还款，如有困难请及时联系我们。',
      category: '还款问题',
    },
    {
      id: 9,
      question: '如何保护我的账户安全？',
      answer: '我们采用银行级别的安全措施：\n• 数据加密传输\n• 多重身份验证\n• 实时监控异常交易\n• 定期安全审计',
      category: '账户安全',
    },
    {
      id: 10,
      question: '忘记密码怎么办？',
      answer: '您可以通过以下方式重置密码：\n1. 点击登录页面的"忘记密码"\n2. 输入注册手机号\n3. 获取验证码\n4. 设置新密码',
      category: '账户安全',
    },
  ];

  const filteredFAQs = selectedCategory === '全部' 
    ? faqData 
    : faqData.filter(faq => faq.category === selectedCategory);

  const toggleExpanded = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scrollView}>
        {/* 头部 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>帮助中心</Text>
          <Text style={styles.headerSubtitle}>常见问题解答</Text>
        </View>

        {/* 分类选择 */}
        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.selectedCategoryButton,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.selectedCategoryButtonText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* FAQ列表 */}
        <View style={styles.faqContainer}>
          {filteredFAQs.map((faq) => (
            <View key={faq.id} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqQuestion}
                onPress={() => toggleExpanded(faq.id)}
              >
                <Text style={styles.questionText}>{faq.question}</Text>
                <Ionicons
                  name={expandedId === faq.id ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
              
              {expandedId === faq.id && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.answerText}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* 联系客服 */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>还有其他问题？</Text>
          <Text style={styles.contactSubtitle}>
            如果以上问题没有解决您的疑问，请联系我们的客服团队
          </Text>
          
          <View style={styles.contactButtons}>
            <TouchableOpacity style={styles.contactButton}>
              <Ionicons name="call" size={20} color="white" />
              <Text style={styles.contactButtonText}>电话客服</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={() => navigation.navigate('Chat')}
            >
              <Ionicons name="chatbubble" size={20} color="white" />
              <Text style={styles.contactButtonText}>在线客服</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  onlineServiceBtn: {
    marginTop: 12,
    alignSelf: 'center',
    backgroundColor: '#667eea',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  onlineServiceBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  categoryContainer: {
    backgroundColor: 'white',
    paddingVertical: 15,
    marginBottom: 10,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  selectedCategoryButton: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  faqContainer: {
    backgroundColor: 'white',
    marginBottom: 10,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  questionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  faqAnswer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  answerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  contactSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 20,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default FAQScreen; 