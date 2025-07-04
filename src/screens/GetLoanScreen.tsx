import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ChatFloatingButton from '../components/ChatFloatingButton';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Chat: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const GetLoanScreen: React.FC = () => {
  const [selectedLoanType, setSelectedLoanType] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState('');

  const loanTypes = [
    {
      id: 1,
      name: '个人消费贷款',
      description: '用于日常消费、旅游、装修等',
      amount: '1-50万',
      rate: '4.35%起',
      icon: 'card',
      color: '#667eea',
    },
    {
      id: 2,
      name: '信用贷款',
      description: '无需抵押，纯信用贷款',
      amount: '1-30万',
      rate: '5.88%起',
      icon: 'trending-up',
      color: '#764ba2',
    },
    {
      id: 3,
      name: '抵押贷款',
      description: '房产抵押，额度更高',
      amount: '10-500万',
      rate: '3.85%起',
      icon: 'home',
      color: '#f093fb',
    },
    {
      id: 4,
      name: '汽车贷款',
      description: '购车专用贷款',
      amount: '5-100万',
      rate: '4.95%起',
      icon: 'car',
      color: '#4facfe',
    },
  ];

  const periods = [
    { label: '6个月', value: '6' },
    { label: '12个月', value: '12' },
    { label: '24个月', value: '24' },
    { label: '36个月', value: '36' },
  ];

  const handleApply = () => {
    if (!selectedLoanType) {
      Alert.alert('提示', '请选择贷款类型');
      return;
    }
    if (!amount) {
      Alert.alert('提示', '请输入贷款金额');
      return;
    }
    if (!period) {
      Alert.alert('提示', '请选择贷款期限');
      return;
    }

    Alert.alert(
      '申请提交',
      '您的贷款申请已提交，我们将在1-3个工作日内与您联系',
      [{ text: '确定', style: 'default' }]
    );
  };

  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scrollView}>
        {/* 头部 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>申请贷款</Text>
          <Text style={styles.headerSubtitle}>选择适合您的贷款产品</Text>
        </View>

        {/* 贷款类型选择 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>选择贷款类型</Text>
          {loanTypes.map((loan) => (
            <TouchableOpacity
              key={loan.id}
              style={[
                styles.loanTypeCard,
                selectedLoanType === loan.id && styles.selectedLoanCard,
              ]}
              onPress={() => setSelectedLoanType(loan.id)}
            >
              <View style={styles.loanTypeHeader}>
                <View style={[styles.loanTypeIcon, { backgroundColor: loan.color }]}>
                  <Ionicons name={loan.icon as any} size={24} color="white" />
                </View>
                <View style={styles.loanTypeInfo}>
                  <Text style={styles.loanTypeName}>{loan.name}</Text>
                  <Text style={styles.loanTypeDescription}>{loan.description}</Text>
                </View>
                {selectedLoanType === loan.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#667eea" />
                )}
              </View>
              <View style={styles.loanTypeDetails}>
                <View style={styles.loanTypeDetail}>
                  <Text style={styles.detailLabel}>额度范围</Text>
                  <Text style={styles.detailValue}>{loan.amount}</Text>
                </View>
                <View style={styles.loanTypeDetail}>
                  <Text style={styles.detailLabel}>年利率</Text>
                  <Text style={styles.detailValue}>{loan.rate}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 申请信息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>申请信息</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>贷款金额（万元）</Text>
            <TextInput
              style={styles.input}
              placeholder="请输入贷款金额"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>贷款期限</Text>
            <View style={styles.periodButtons}>
              {periods.map((p) => (
                <TouchableOpacity
                  key={p.value}
                  style={[
                    styles.periodButton,
                    period === p.value && styles.selectedPeriodButton,
                  ]}
                  onPress={() => setPeriod(p.value)}
                >
                  <Text
                    style={[
                      styles.periodButtonText,
                      period === p.value && styles.selectedPeriodButtonText,
                    ]}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* 申请按钮 */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>立即申请</Text>
          </TouchableOpacity>
          
          <Text style={styles.applyNote}>
            申请提交后，我们的专业顾问将在1-3个工作日内与您联系
          </Text>
        </View>

        {/* 申请流程 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>申请流程</Text>
          <View style={styles.processSteps}>
            <View style={styles.processStep}>
              <View style={styles.processStepIcon}>
                <Text style={styles.processStepNumber}>1</Text>
              </View>
              <Text style={styles.processStepText}>填写申请信息</Text>
            </View>
            <View style={styles.processStep}>
              <View style={styles.processStepIcon}>
                <Text style={styles.processStepNumber}>2</Text>
              </View>
              <Text style={styles.processStepText}>提交审核</Text>
            </View>
            <View style={styles.processStep}>
              <View style={styles.processStepIcon}>
                <Text style={styles.processStepNumber}>3</Text>
              </View>
              <Text style={styles.processStepText}>审核通过</Text>
            </View>
            <View style={styles.processStep}>
              <View style={styles.processStepIcon}>
                <Text style={styles.processStepNumber}>4</Text>
              </View>
              <Text style={styles.processStepText}>放款到账</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <ChatFloatingButton onPress={() => navigation.navigate('Chat')} />
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
  section: {
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  loanTypeCard: {
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  selectedLoanCard: {
    borderColor: '#667eea',
    backgroundColor: '#f8f9ff',
  },
  loanTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  loanTypeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  loanTypeInfo: {
    flex: 1,
  },
  loanTypeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  loanTypeDescription: {
    fontSize: 14,
    color: '#666',
  },
  loanTypeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  loanTypeDetail: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  periodButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  periodButton: {
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
  },
  selectedPeriodButton: {
    borderColor: '#667eea',
    backgroundColor: '#667eea',
  },
  periodButtonText: {
    fontSize: 14,
    color: '#666',
  },
  selectedPeriodButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  applyButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  applyNote: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  processSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  processStep: {
    alignItems: 'center',
    flex: 1,
  },
  processStepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  processStepNumber: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  processStepText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default GetLoanScreen; 